-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS untitled_table_210_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('untitled_table_210_id_seq'::regclass),
    "email" varchar,
    "fullName" varchar,
    "phoneNumber" varchar,
    "password" varchar,
    "photo" text DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'::character varying
);

INSERT INTO "public"."users" ("id", "email", "fullName", "phoneNumber", "password", "photo") VALUES
(53, 'dani@gmail.com', 'dani', '0581555', '$2b$10$uqac2hHreMC7gO10hk2KIuCCPjPxm0Y2Kwgf148Fe/.fhnAC.AzNq', 'https://res.cloudinary.com/dkehmtgjl/image/upload/v1684254215/eorflwxaqulr1mgelwgw.png');
INSERT INTO "public"."users" ("id", "email", "fullName", "phoneNumber", "password", "photo") VALUES
(54, 'danu@gmail.com', 'danu', '0581555', '$2b$10$H19/ZWPJ6qxZn59wHPHY9e6CxBZ5KCrz19DQkLIqp3wE1odbgzsfS', 'https://res.cloudinary.com/dkehmtgjl/image/upload/v1684316595/kevo580o3dcoowwfmscb.png');
INSERT INTO "public"."users" ("id", "email", "fullName", "phoneNumber", "password", "photo") VALUES
(55, 'sony@gmail.com', 'sony', '0581555', '$2b$10$FmAD.5n0DPqpeijNMWVA8eIA5fwbsmLypPmPItncc5fsHtoIPq74a', 'https://res.cloudinary.com/dkehmtgjl/image/upload/v1684317719/kfzxktdnmkmy8csfkawj.png');
INSERT INTO "public"."users" ("id", "email", "fullName", "phoneNumber", "password", "photo") VALUES
(42, 'leonel@gmail.com', 'leonel', '0581555', '$2b$10$64Nm4L8vjKcqtaqRCoL3cuw10STyH86hgAPbQF4zBK56mUcK3W27u', 'leonel.jpg'),
(44, 'nana@gmail.com', 'nana', '0581555', '$2b$10$kRiu.YEMoF2nYBhO/zs06uNAI47kk/LpMYD5NC0OTU./E.UzFAXli', 'nana.jpg'),
(45, 'andi@gmail.com', 'nana', '0581555', '$2b$10$kRiu.YEMoF2nYBhO/zs06uNAI47kk/LpMYD5NC0OTU./E.UzFAXli', 'nana.jpg'),
(46, 'hani@gmail.com', 'leonel', '0581555', 'hani', 'leonel.jpg'),
(47, 'benjol@gmail.com', 'leonel', '0581555', '$2b$10$JrpjC/2sWoCxN7xdWB.JkOJLFKbMvJUc6eWf7rAnbkMmJRFBG7T.6', 'leonel.jpg'),
(52, 'nabila@gmail.com', 'baila', '084161', 'nabila', 'nabila');