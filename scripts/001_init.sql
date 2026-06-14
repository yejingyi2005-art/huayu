-- =============================================
-- 花屿 (Huayu) 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行
-- =============================================

-- 1. Users
CREATE TABLE users (
  user_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname   VARCHAR(50) NOT NULL,
  avatar     TEXT,
  email      VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Gardens
CREATE TABLE gardens (
  garden_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  invite_code VARCHAR(20) UNIQUE NOT NULL
);

-- 3. Garden Members (多对多)
CREATE TABLE garden_members (
  garden_id UUID REFERENCES gardens(garden_id) ON DELETE CASCADE,
  user_id   UUID REFERENCES users(user_id) ON DELETE CASCADE,
  role      VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (garden_id, user_id)
);

-- 4. Traces
CREATE TABLE traces (
  trace_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_id  UUID REFERENCES gardens(garden_id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES users(user_id) ON DELETE SET NULL,
  type       VARCHAR(20) NOT NULL CHECK (type IN ('photo', 'text', 'mood')),
  content    JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_traces_garden_created ON traces(garden_id, created_at DESC);

-- 5. Memory Books
CREATE TABLE memory_books (
  book_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_id  UUID REFERENCES gardens(garden_id) ON DELETE CASCADE NOT NULL,
  season     VARCHAR(20) NOT NULL CHECK (season IN ('spring', 'summer', 'autumn', 'winter')),
  year       INTEGER NOT NULL,
  summary    TEXT,
  cover_url  TEXT,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(garden_id, season, year)
);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_books ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update own profile
CREATE POLICY users_select ON users FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY users_update ON users FOR UPDATE
  USING (user_id = auth.uid());

-- Gardens: only members can view
CREATE POLICY gardens_select ON gardens FOR SELECT
  USING (garden_id IN (
    SELECT garden_id FROM garden_members WHERE user_id = auth.uid()
  ));

CREATE POLICY gardens_insert ON gardens FOR INSERT
  WITH CHECK (true);

CREATE POLICY gardens_update ON gardens FOR UPDATE
  USING (garden_id IN (
    SELECT garden_id FROM garden_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- Garden members: members can view, owners can manage
CREATE POLICY garden_members_select ON garden_members FOR SELECT
  USING (garden_id IN (
    SELECT garden_id FROM garden_members WHERE user_id = auth.uid()
  ));

CREATE POLICY garden_members_insert ON garden_members FOR INSERT
  WITH CHECK (true);

-- Traces: members can CRUD
CREATE POLICY traces_select ON traces FOR SELECT
  USING (garden_id IN (
    SELECT garden_id FROM garden_members WHERE user_id = auth.uid()
  ));

CREATE POLICY traces_insert ON traces FOR INSERT
  WITH CHECK (garden_id IN (
    SELECT garden_id FROM garden_members WHERE user_id = auth.uid()
  ));

CREATE POLICY traces_delete ON traces FOR DELETE
  USING (user_id = auth.uid());

-- Memory books: members can view
CREATE POLICY memory_books_select ON memory_books FOR SELECT
  USING (garden_id IN (
    SELECT garden_id FROM garden_members WHERE user_id = auth.uid()
  ));

-- =============================================
-- 存储桶 (需在 Supabase Storage 手动创建)
-- bucket name: trace-photos
-- public: false
-- =============================================

-- =============================================
-- 自动创建用户档案触发器
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO users (user_id, nickname, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', '花屿用户'),
    NEW.raw_user_meta_data ->> 'avatar'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
