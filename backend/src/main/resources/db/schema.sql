-- 玩家表
CREATE TABLE IF NOT EXISTS player (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    nickname        VARCHAR(50) NOT NULL,
    level           INT DEFAULT 1,
    exp             BIGINT DEFAULT 0,
    gold            BIGINT DEFAULT 0,
    diamond         INT DEFAULT 100,
    attack          INT DEFAULT 10,
    defense         INT DEFAULT 5,
    hp              INT DEFAULT 100,
    max_hp          INT DEFAULT 100,
    last_offline_time TIMESTAMP DEFAULT NOW(),
    idle_gold_rate  DECIMAL(10,2) DEFAULT 1.0,
    idle_exp_rate   DECIMAL(10,2) DEFAULT 0.5,
    current_stage_id INT DEFAULT 1,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- 宠物模板表
CREATE TABLE IF NOT EXISTS pet_template (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    description     TEXT,
    rarity          VARCHAR(20) NOT NULL,
    base_attack     INT DEFAULT 10,
    base_defense    INT DEFAULT 5,
    base_hp         INT DEFAULT 50,
    skill_name      VARCHAR(50),
    skill_desc      TEXT,
    skill_damage    INT DEFAULT 0,
    evolution_to    INT,
    evolution_cost  INT DEFAULT 0,
    image_url       VARCHAR(255)
);

-- 玩家宠物表
CREATE TABLE IF NOT EXISTS player_pet (
    id              BIGSERIAL PRIMARY KEY,
    player_id       BIGINT NOT NULL REFERENCES player(id),
    pet_template_id INT NOT NULL REFERENCES pet_template(id),
    level           INT DEFAULT 1,
    exp             BIGINT DEFAULT 0,
    attack          INT,
    defense         INT,
    hp              INT,
    skill_level     INT DEFAULT 1,
    is_active       BOOLEAN DEFAULT false,
    slot_position   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 关卡表
CREATE TABLE IF NOT EXISTS stage (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    chapter         INT NOT NULL,
    stage_order     INT NOT NULL,
    description     TEXT,
    monster_name    VARCHAR(50),
    monster_attack  INT,
    monster_defense INT,
    monster_hp      INT,
    gold_reward     INT,
    exp_reward      INT,
    material_type   VARCHAR(50),
    material_amount INT DEFAULT 0,
    required_level  INT DEFAULT 1
);

-- 物品表
CREATE TABLE IF NOT EXISTS item (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    description     TEXT,
    type            VARCHAR(30) NOT NULL,
    rarity          VARCHAR(20),
    attack_bonus    INT DEFAULT 0,
    defense_bonus   INT DEFAULT 0,
    hp_bonus        INT DEFAULT 0,
    buy_price       INT,
    sell_price      INT,
    image_url       VARCHAR(255)
);

-- 玩家背包表
CREATE TABLE IF NOT EXISTS player_inventory (
    id              BIGSERIAL PRIMARY KEY,
    player_id       BIGINT NOT NULL REFERENCES player(id),
    item_id         INT NOT NULL REFERENCES item(id),
    quantity        INT DEFAULT 1,
    is_equipped     BOOLEAN DEFAULT false,
    equipped_slot   VARCHAR(20)
);

-- 成就表
CREATE TABLE IF NOT EXISTS achievement (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    type            VARCHAR(30) NOT NULL,
    target_value    INT NOT NULL,
    reward_type     VARCHAR(20),
    reward_value    INT
);

-- 玩家成就进度表
CREATE TABLE IF NOT EXISTS player_achievement (
    id              BIGSERIAL PRIMARY KEY,
    player_id       BIGINT NOT NULL REFERENCES player(id),
    achievement_id  INT NOT NULL REFERENCES achievement(id),
    current_value   INT DEFAULT 0,
    is_completed    BOOLEAN DEFAULT false,
    completed_at    TIMESTAMP,
    is_rewarded     BOOLEAN DEFAULT false
);

-- 商店物品表
CREATE TABLE IF NOT EXISTS shop_item (
    id              SERIAL PRIMARY KEY,
    item_id         INT REFERENCES item(id),
    pet_template_id INT REFERENCES pet_template(id),
    price_type      VARCHAR(20) NOT NULL,
    price           INT NOT NULL,
    stock           INT DEFAULT -1,
    is_active       BOOLEAN DEFAULT true
);

-- 初始宠物模板数据
INSERT INTO pet_template (name, description, rarity, base_attack, base_defense, base_hp, skill_name, skill_desc, skill_damage, evolution_to, evolution_cost) VALUES
('小青蛇', '一条修炼百年的青蛇，灵性十足', 'N', 8, 3, 30, '蛇咬', '用毒牙攻击敌人', 15, 2, 10),
('青蛟', '青蛇进化而来，已生出双角', 'R', 20, 10, 80, '蛟龙击', '蛟龙之力猛烈一击', 40, NULL, 0),
('灵狐', '山中修炼的白狐，聪慧过人', 'N', 6, 4, 35, '狐魅', '魅惑之术降低敌人防御', 10, 4, 10),
('九尾灵狐', '灵狐进化，九尾齐展', 'R', 18, 12, 90, '九尾幻术', '幻术攻击全体敌人', 35, NULL, 0),
('石猴', '花果山的灵猴，天生神力', 'SR', 25, 8, 60, '猴拳', '迅猛的连击', 50, 6, 20),
('齐天大圣', '石猴觉醒，大闹天宫', 'SSR', 50, 20, 150, '如意金箍棒', '毁天灭地的一击', 120, NULL, 0),
('小火凤', '刚出生的火凤幼崽', 'N', 10, 2, 25, '凤火', '喷射火焰攻击', 18, 8, 10),
('火凤凰', '浴火重生的神鸟', 'R', 22, 8, 70, '涅槃之焰', '凤凰之火焚烧一切', 45, NULL, 0),
('玄龟', '上古神兽玄武的后裔', 'SR', 12, 30, 120, '龟壳护盾', '大幅提升自身防御', 20, 10, 20),
('玄武神兽', '北方神兽玄武降临', 'SSR', 35, 60, 300, '玄武结界', '全体减伤护盾', 60, NULL, 0);

-- 初始关卡数据
INSERT INTO stage (name, chapter, stage_order, description, monster_name, monster_attack, monster_defense, monster_hp, gold_reward, exp_reward, material_type, material_amount, required_level) VALUES
('青竹林', 1, 1, '翠竹摇曳，偶有小妖出没', '竹妖', 5, 2, 50, 10, 15, '竹叶', 1, 1),
('青竹林深处', 1, 2, '竹林深处妖气渐浓', '竹精', 8, 3, 80, 15, 25, '竹叶', 2, 1),
('清风洞', 1, 3, '洞中清风徐来，暗藏玄机', '石怪', 12, 5, 120, 20, 35, '灵石', 1, 2),
('落霞峰', 2, 4, '落霞与孤鹜齐飞', '山贼', 15, 6, 150, 30, 50, '灵石', 2, 3),
('落霞峰顶', 2, 5, '峰顶风起云涌', '山贼头目', 20, 8, 200, 40, 65, '灵石', 3, 4),
('幽冥涧', 2, 6, '涧水幽深，鬼影憧憧', '水鬼', 25, 10, 280, 50, 80, '冥石', 1, 5),
('碧落潭', 3, 7, '碧波万顷，潭底有龙', '蛟龙', 30, 12, 350, 65, 100, '冥石', 2, 6),
('碧落潭底', 3, 8, '龙宫遗迹，宝藏无数', '龙宫守卫', 35, 15, 450, 80, 120, '龙鳞', 1, 7),
('天机阁', 3, 9, '天机不可泄露', '天机傀儡', 40, 18, 550, 100, 150, '龙鳞', 2, 8),
('南天门', 4, 10, '天庭南天门，仙气飘飘', '天兵', 50, 22, 700, 150, 200, '仙石', 1, 10);

-- 初始物品数据
INSERT INTO item (name, description, type, rarity, attack_bonus, defense_bonus, hp_bonus, buy_price, sell_price) VALUES
('铁剑', '普通的铁制长剑', 'weapon', 'N', 5, 0, 0, 100, 50),
('青锋剑', '锋利的青锋宝剑', 'weapon', 'R', 15, 0, 0, 500, 250),
('玄铁重剑', '重剑无锋，大巧不工', 'weapon', 'SR', 30, 5, 0, 2000, 1000),
('布衣', '普通的麻布衣服', 'armor', 'N', 0, 3, 10, 80, 40),
('锁子甲', '精铁打造的锁子甲', 'armor', 'R', 0, 10, 30, 400, 200),
('玄铁甲', '玄铁锻造，刀枪不入', 'armor', 'SR', 0, 25, 80, 1800, 900),
('玉佩', '温润的玉石佩饰', 'accessory', 'N', 2, 2, 20, 150, 75),
('龙纹玉佩', '刻有龙纹的珍贵玉佩', 'accessory', 'R', 8, 8, 50, 800, 400),
('竹叶', '青竹林中采集的竹叶', 'material', 'N', 0, 0, 0, 10, 5),
('灵石', '蕴含灵力的石头', 'material', 'R', 0, 0, 0, 50, 25),
('冥石', '幽冥之地的神秘矿石', 'material', 'SR', 0, 0, 0, 200, 100),
('龙鳞', '龙族褪下的鳞片', 'material', 'SSR', 0, 0, 0, 500, 250),
('仙石', '仙界之石，价值连城', 'material', 'SSR', 0, 0, 0, 1000, 500);

-- 初始成就数据
INSERT INTO achievement (name, description, type, target_value, reward_type, reward_value) VALUES
('初入江湖', '角色等级达到5级', 'level', 5, 'diamond', 50),
('小有成就', '角色等级达到10级', 'level', 10, 'diamond', 100),
('江湖高手', '角色等级达到20级', 'level', 20, 'diamond', 200),
('一代宗师', '角色等级达到50级', 'level', 50, 'diamond', 500),
('初战告捷', '通过第1关', 'stage', 1, 'gold', 200),
('势如破竹', '通过第5关', 'stage', 5, 'gold', 1000),
('百战百胜', '通过第10关', 'stage', 10, 'diamond', 300),
('宠物收集者', '收集3只宠物', 'pet_collect', 3, 'diamond', 100),
('宠物大师', '收集5只宠物', 'pet_collect', 5, 'diamond', 300),
('富甲一方', '累计获得10000金币', 'gold', 10000, 'diamond', 100);

-- 初始商店数据
INSERT INTO shop_item (item_id, pet_template_id, price_type, price, stock) VALUES
(1, NULL, 'gold', 100, -1),
(2, NULL, 'gold', 500, -1),
(4, NULL, 'gold', 80, -1),
(5, NULL, 'gold', 400, -1),
(7, NULL, 'gold', 150, -1),
(NULL, 1, 'diamond', 200, -1),
(NULL, 3, 'diamond', 200, -1),
(NULL, 5, 'diamond', 500, -1),
(NULL, 7, 'diamond', 200, -1);
