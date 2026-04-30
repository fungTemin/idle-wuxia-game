# 仙侠放置录

> 一款基于 React + Spring Boot 的全栈放置类 RPG 游戏，采用极简中国黑白水墨画风格 (Mono-chromatic Ink Wash)。

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 游戏简介

**仙侠放置录**是一款以中国武侠仙侠为背景的放置类游戏。玩家扮演修仙者，通过放置修炼、闯关战斗、收集灵宠、购买装备来不断提升境界，最终证道飞升。

### 核心玩法

| 系统 | 说明 |
|------|------|
| **放置修炼** | 离线自动积累修为和灵石，最多存储 24 小时收益 |
| **闯关战斗** | 10 个关卡，自动战斗，快速扫荡已通关卡 |
| **灵宠系统** | 10 种灵宠（含进化链），召唤、升级、进化、灵技修炼、阵容搭配 |
| **商铺系统** | 装备购买/出售，背包管理，装备穿戴 |
| **成就系统** | 10 种成就，进度追踪，奖励领取 |

### 修仙境界

```
练气初 → 练气中 → 练气后 → 筑基初 → 筑基中 → 筑基后
→ 金丹初 → 金丹中 → 金丹后 → 元婴初 → 元婴中 → 元婴后 → 化神
```

---

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  React 18 + TypeScript + Vite + Zustand                 │
│  极简黑白水墨风 UI (Mono-chromatic Ink Wash)            │
│                     Port: 5173                          │
├─────────────────────────────────────────────────────────┤
│                      Backend                            │
│  Spring Boot 3.5 + MyBatis-Plus + JWT                   │
│  RESTful API                                            │
│                     Port: 8080                          │
├─────────────────────────────────────────────────────────┤
│                      Database                           │
│  PostgreSQL 16 (Docker)                                 │
│                     Port: 5432                          │
└─────────────────────────────────────────────────────────┘
```

### 后端技术栈

- **Spring Boot 3.5** - 应用框架
- **Spring Security** - 安全认证
- **MyBatis-Plus 3.5** - ORM 框架
- **JWT (jjwt)** - 无状态认证
- **PostgreSQL** - 关系型数据库
- **Gradle** - 构建工具

### 前端技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **Axios** - HTTP 客户端
- **React Router** - 路由管理

---

## 项目结构

```
idle-wuxia-game/
├── backend/                              # Spring Boot 后端
│   ├── build.gradle                      # Gradle 配置
│   └── src/main/java/com/idlewuxia/
│       ├── config/                       # 配置类
│       │   ├── SecurityConfig.java       # 安全配置 + JWT
│       │   ├── CorsConfig.java           # 跨域配置
│       │   └── MyBatisPlusConfig.java    # MyBatis 配置
│       ├── controller/                   # 控制器层 (8个)
│       ├── service/                      # 业务逻辑层 (6个接口+实现)
│       ├── mapper/                       # 数据访问层 (9个)
│       ├── entity/                       # 实体类 (9个)
│       ├── dto/                          # 数据传输对象
│       ├── vo/                           # 视图对象
│       └── util/                         # 工具类 (JWT, Result)
│
├── frontend/                             # React 前端
│   ├── src/
│   │   ├── api/                          # API 请求封装
│   │   ├── components/layout/            # 布局组件
│   │   ├── pages/                        # 页面组件 (6个)
│   │   ├── stores/                       # Zustand 状态管理
│   │   ├── assets/svg/                   # 水墨画 SVG 资源
│   │   ├── types/                        # TypeScript 类型
│   │   └── index.css                     # 水墨风格样式系统
│   └── package.json
│
└── README.md
```

---

## 快速开始

### 环境要求

- **Java 17+**
- **Node.js 18+**
- **Docker** (用于运行 PostgreSQL)
- **Gradle** (或使用项目自带的 gradlew)

### 1. 启动数据库

```bash
docker run -d --name idle-wuxia-postgres \
  -e POSTGRES_DB=idle_wuxia \
  -e POSTGRES_USER=idlewuxia \
  -e POSTGRES_PASSWORD=idlewuxia123 \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. 启动后端

```bash
cd backend
./gradlew bootRun
```

后端运行在 `http://localhost:8080`

### 3. 初始化数据库

```bash
curl -X POST http://localhost:8080/api/init/schema
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

### 5. 开始游戏

打开浏览器访问 `http://localhost:5173`，注册账号即可开始游戏。

---

## API 接口

### 认证模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |

### 玩家模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/player/info` | 获取玩家信息 |
| POST | `/api/player/idle-reward` | 领取离线收益 |
| POST | `/api/player/upgrade` | 升级角色 |

### 灵宠模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/pets` | 获取所有灵宠 |
| POST | `/api/pets/summon` | 召唤灵宠 |
| POST | `/api/pets/{id}/upgrade` | 灵宠升级 |
| POST | `/api/pets/{id}/evolve` | 灵宠进化 |
| POST | `/api/pets/{id}/upgrade-skill` | 灵技升级 |
| PUT | `/api/pets/{id}/activate` | 上阵/下阵 |

### 战斗模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stages` | 获取关卡列表 |
| POST | `/api/battle/start` | 开始战斗 |
| POST | `/api/battle/quick` | 快速扫荡 |

### 商店模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/shop/items` | 获取商品 |
| POST | `/api/shop/buy` | 购买 |
| POST | `/api/shop/sell` | 出售 |
| GET | `/api/inventory` | 获取背包 |
| POST | `/api/inventory/equip` | 装备 |
| POST | `/api/inventory/unequip` | 卸下 |

### 成就模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/achievements` | 获取成就列表 |
| POST | `/api/achievements/{id}/claim` | 领取奖励 |

---

## 数据库设计

### 核心表

| 表名 | 说明 |
|------|------|
| `player` | 玩家表（账号、属性、资源、放置速率） |
| `pet_template` | 宠物模板（10种灵宠数据） |
| `player_pet` | 玩家宠物实例 |
| `stage` | 关卡表（10个关卡） |
| `item` | 物品表（装备、材料） |
| `player_inventory` | 玩家背包 |
| `achievement` | 成就模板 |
| `player_achievement` | 玩家成就进度 |
| `shop_item` | 商店商品 |

### 初始数据

- **10 种灵宠**：小青蛇 → 青蛟、灵狐 → 九尾灵狐、石猴 → 齐天大圣、小火凤 → 火凤凰、玄龟 → 玄武神兽
- **10 个关卡**：青竹林 → 南天门，4 个章节
- **13 种物品**：武器、护甲、法器、材料
- **10 种成就**：等级、关卡、收集、金币

---

## UI 设计风格

采用**极简中国黑白水墨画风格** (Mono-chromatic Ink Wash)：

- **配色**：玄黑、灰阶、象牙白为主，朱砂红点睛
- **背景**：宣纸纤维质感，大面积留白
- **面板**：半透明墨雾边缘，如云雾悬浮
- **按钮**：实心墨块 / 朱砂印章，文字反白
- **进度条**：飞白飞溅效果，水墨流动轨迹
- **导航**：竹节装饰，飞白书法笔触下划线
- **图标**：白描勾勒 (outline ink stroke) 风格

---

## 测试账号

首次使用需要注册账号。也可以使用以下方式快速测试：

```bash
# 注册
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456","nickname":"测试侠客"}'

# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

---

## 开发计划

- [ ] 宠物经验自动增长
- [ ] 装备强化系统
- [ ] 更多关卡和章节
- [ ] 排行榜系统
- [ ] 每日任务
- [ ] 音效和背景音乐
- [ ] 移动端适配优化

---

## License

MIT

---

> 笔墨纸砚 · 仙侠放置录
