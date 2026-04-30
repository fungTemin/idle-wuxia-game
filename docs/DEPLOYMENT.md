# 部署指南

本文档记录「仙侠放置录」的部署方案，供后续上线参考。

---

## 一、部署架构

```
                    ┌─────────────────┐
                    │   Nginx (80/443)│
                    │   静态资源 + 反代│
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────┴────────┐          ┌─────────┴─────────┐
     │  前端 (dist/)   │          │  后端 (8080)      │
     │  React SPA      │          │  Spring Boot JAR  │
     └─────────────────┘          └─────────┬─────────┘
                                            │
                                   ┌────────┴────────┐
                                   │  PostgreSQL     │
                                   │  (5432)         │
                                   └─────────────────┘
```

---

## 二、服务器要求

| 资源 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 1 核 | 2 核 |
| 内存 | 1 GB | 2 GB |
| 硬盘 | 20 GB | 40 GB |
| 操作系统 | Ubuntu 20.04+ / CentOS 7+ | Ubuntu 22.04 LTS |
| Java | 17+ | 17 LTS |
| Node.js | 18+ (仅构建时) | 20 LTS |
| PostgreSQL | 14+ | 16 |

---

## 三、部署步骤

### 3.1 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Java 17
sudo apt install openjdk-17-jre -y

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 安装 Nginx
sudo apt install nginx -y
```

### 3.2 数据库配置

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE idle_wuxia;
CREATE USER idlewuxia WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE idle_wuxia TO idlewuxia;
\q

# 导入初始化脚本
psql -U idlewuxia -d idle_wuxia -f schema.sql
```

### 3.3 后端部署

```bash
# 构建 JAR 包
cd backend
./gradlew build -x test

# 复制到服务器
scp build/libs/idle-wuxia-0.0.1-SNAPSHOT.jar user@server:/opt/idle-wuxia/

# 创建 systemd 服务
sudo nano /etc/systemd/system/idle-wuxia.service
```

服务文件内容：
```ini
[Unit]
Description=Idle Wuxia Game Backend
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/idle-wuxia
ExecStart=/usr/bin/java -jar idle-wuxia-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

生产环境配置 `application-prod.yml`：
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/idle_wuxia
    username: idlewuxia
    password: your_secure_password

jwt:
  secret: ${JWT_SECRET}  # 使用环境变量

logging:
  level:
    root: WARN
    com.idlewuxia: INFO
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable idle-wuxia
sudo systemctl start idle-wuxia
```

### 3.4 前端部署

```bash
# 本地构建
cd frontend
npm run build

# 复制到服务器
scp -r dist/* user@server:/var/www/idle-wuxia/
```

### 3.5 Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态资源
    root /var/www/idle-wuxia;
    index index.html;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/idle-wuxia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 四、HTTPS 配置（推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 五、备份策略

### 数据库备份

```bash
# 创建备份脚本
cat > /opt/idle-wuxia/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/idle-wuxia/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U idlewuxia idle_wuxia > "$BACKUP_DIR/backup_$DATE.sql"
# 保留最近 7 天
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/idle-wuxia/backup.sh

# 添加定时任务
crontab -e
# 每天凌晨 3 点备份
0 3 * * * /opt/idle-wuxia/backup.sh
```

---

## 六、监控

### 简单健康检查

```bash
# 检查后端状态
curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"123456"}'

# 检查前端
curl -I http://localhost
```

### 日志查看

```bash
# 后端日志
sudo journalctl -u idle-wuxia -f

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 七、常见问题

### Q: 后端启动失败，提示数据库连接错误
A: 检查 PostgreSQL 是否启动，用户名密码是否正确，防火墙是否开放 5432 端口。

### Q: 前端页面空白
A: 检查 Nginx 配置中的 `root` 路径是否正确，`try_files` 是否配置。

### Q: API 请求 404
A: 检查 Nginx 的 `location /api/` 反向代理配置是否正确。

---

## 八、部署检查清单

- [ ] Java 17 已安装
- [ ] PostgreSQL 已安装并创建数据库
- [ ] 导入了 schema.sql 初始化数据
- [ ] 后端 JAR 包已构建并部署
- [ ] systemd 服务已配置并启动
- [ ] 前端已构建并复制到 Nginx 目录
- [ ] Nginx 配置已启用
- [ ] 防火墙已开放 80/443 端口
- [ ] HTTPS 证书已配置（推荐）
- [ ] 备份策略已配置
- [ ] 健康检查通过

---

*最后更新：2026-04-30*
