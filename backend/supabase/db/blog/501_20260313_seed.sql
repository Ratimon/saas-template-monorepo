-- ---------------------------
-- MODULE NAME: Blog System Seed Data
-- MODULE DATE: 20260313
-- MODULE SCOPE: Initial Data
-- ---------------------------

BEGIN;

-- ---------------------------
-- Create Blog Images Bucket
-- ---------------------------
INSERT INTO storage.buckets (
    id, 
    name,
    public,
    avif_autodetection,
    file_size_limit,
    allowed_mime_types
) VALUES (
    'blog_images',
    'blog_images',
    TRUE,
    FALSE,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------
-- Seed Blog Topics
-- ---------------------------
-- Main Topics
INSERT INTO public.blog_topics (id, name, description) VALUES
    ('d5f7a000-0000-4000-a000-000000000001', 'Marketing', 'Marketing strategies and tips'),
    ('d5f7a000-0000-4000-a000-000000000002', 'Business', 'Business development and growth')
ON CONFLICT (id) DO NOTHING;

-- Marketing Subtopics
INSERT INTO public.blog_topics (id, name, description, parent_id) VALUES
    ('d5f7a000-0000-4000-a000-000000000003', 'Content Marketing', 'Content creation and strategy', 'd5f7a000-0000-4000-a000-000000000001'),
    ('d5f7a000-0000-4000-a000-000000000004', 'Social Media', 'Social media marketing tips', 'd5f7a000-0000-4000-a000-000000000001'),
    ('d5f7a000-0000-4000-a000-000000000005', 'Email Marketing', 'Email campaign strategies', 'd5f7a000-0000-4000-a000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Business Subtopics
INSERT INTO public.blog_topics (id, name, description, parent_id) VALUES
    ('d5f7a000-0000-4000-a000-000000000006', 'Startups', 'Startup tips and guides', 'd5f7a000-0000-4000-a000-000000000002'),
    ('d5f7a000-0000-4000-a000-000000000007', 'Growth', 'Business growth strategies', 'd5f7a000-0000-4000-a000-000000000002'),
    ('d5f7a000-0000-4000-a000-000000000008', 'Management', 'Business management tips', 'd5f7a000-0000-4000-a000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------
-- Seed Sample Blog Post
-- ---------------------------
INSERT INTO public.blog_posts (
    title,
    description,
    content,
    topic_id,
    is_admin_approved,
    is_user_published
) VALUES (
    'Welcome to Our Blog',
    'Learn about our blog system and how to use it effectively',
    '# Welcome to Our Blog

This is a sample blog post that demonstrates the capabilities of our blog system.

## Features

- Rich text editing
- Beautiful and responsive design
- SEO optimization
- And much more!

Get started by creating your first blog post today!',
    'd5f7a000-0000-4000-a000-000000000004', -- Content Marketing topic
    true,
    true
)
ON CONFLICT DO NOTHING;

-- ---------------------------
-- Module Configs
-- ---------------------------

INSERT INTO public.module_configs (module_name, config) VALUES
(
    'blog',
    '{
  "BLOG_POST_SEO_META_TITLE": "Blog",
  "BLOG_POST_SEO_META_DESCRIPTION": "Here you can find all published blog posts.",
  "BLOG_POST_SEO_META_TAGS": "blog, articles, news, content"
}'::jsonb
)
ON CONFLICT (module_name) DO NOTHING;

-- ---------------------------
-- END OF FILE
-- ---------------------------

COMMIT;

