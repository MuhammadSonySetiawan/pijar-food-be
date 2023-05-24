-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "Recipes_id_seq";

-- Table Definition
CREATE TABLE "public"."recipes" (
    "id" int4 NOT NULL DEFAULT nextval('"Recipes_id_seq"'::regclass),
    "recipePicture" varchar,
    "title" varchar,
    "ingredients" varchar,
    "videoLink" varchar,
    "createAt" timestamptz DEFAULT now()
);

INSERT INTO "public"."recipes" ("id", "recipePicture", "title", "ingredients", "videoLink", "createAt") VALUES
(1, 'Hamburfer Bigsize.jpg', 'Hamburfer Bigsize', 'Gunakan 2 roti dan belah manjadi 2 bagian. lalu masukan daing dan sayuran serta saus dan mayonasi tutup dan siap di sajikan', 'Hamburfer Bigsize.3gp', NULL);
INSERT INTO "public"."recipes" ("id", "recipePicture", "title", "ingredients", "videoLink", "createAt") VALUES
(5, 'sambal.jpg', 'sambal', 'sambal', 'sambal.3gp', NULL);
INSERT INTO "public"."recipes" ("id", "recipePicture", "title", "ingredients", "videoLink", "createAt") VALUES
(6, 'pizzaaa.jpg', 'pizzaaa', 'Buat adonan, lalu pipihkan dan bentuk menjadi lingkaran. setelah itu masukan isi di atas adonan.  lalu panggang hingga warna kecoklatan . sajikan', 'pizzaaa.3gp', NULL);
INSERT INTO "public"."recipes" ("id", "recipePicture", "title", "ingredients", "videoLink", "createAt") VALUES
(8, 'pizzaaa.jpg', 'pizzaaa', 'Buat adonan, lalu pipihkan dan bentuk menjadi lingkaran. setelah itu masukan isi di atas adonan.  lalu panggang hingga warna kecoklatan . sajikan', 'pizzaaa.3gp', NULL),
(9, 'samabl teri.jpg', 'samabl ter', 'samabl ter', 'samabl teri.3gp', '2023-05-11 22:05:22.114471+07'),
(10, 'text', 'text', 'text', 'text', '2023-05-13 02:13:21.016127+07'),
(11, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.232436+07'),
(12, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.289622+07'),
(13, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.292137+07'),
(14, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.2941+07'),
(15, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.296579+07'),
(16, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.299262+07'),
(17, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.302873+07'),
(18, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.305508+07'),
(19, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.307432+07'),
(20, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.309581+07'),
(21, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.31183+07'),
(22, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.314334+07'),
(23, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.317087+07'),
(24, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.319542+07'),
(25, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.321334+07'),
(26, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.325241+07'),
(27, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.327073+07'),
(28, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.328724+07'),
(29, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.330828+07'),
(30, 'text', 'text', 'text', 'text', '2023-05-13 13:51:12.353169+07'),
(31, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.086881+07'),
(32, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.090303+07'),
(33, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.092252+07'),
(34, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.09407+07'),
(35, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.095909+07'),
(36, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.100059+07'),
(37, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.102905+07'),
(38, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.105811+07'),
(39, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.107616+07'),
(40, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.110046+07'),
(41, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.111775+07'),
(42, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.113339+07'),
(43, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.118457+07'),
(44, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.120411+07'),
(45, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.122078+07'),
(46, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.123579+07'),
(47, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.160937+07'),
(48, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.162643+07'),
(49, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.164255+07'),
(50, 'text', 'text', 'text', 'text', '2023-05-13 14:25:11.166487+07');