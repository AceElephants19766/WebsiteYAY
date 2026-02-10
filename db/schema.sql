-- Admin News/Updates System Database Schema
-- Database: Neon Postgres
-- Run this SQL in your Neon SQL Editor or via psql

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ NULL
);

-- Create index for efficient querying of published updates
CREATE INDEX IF NOT EXISTS idx_updates_status_published 
ON updates(status, published_at DESC);

-- Create index for admin list (all updates by created_at)
CREATE INDEX IF NOT EXISTS idx_updates_created 
ON updates(created_at DESC);

-- Optional: Add trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_updates_updated_at 
    BEFORE UPDATE ON updates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
