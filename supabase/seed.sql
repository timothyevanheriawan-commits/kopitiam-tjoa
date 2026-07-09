-- Kopitiam Tjoa — seed data
-- Run after schema.sql. Safe to re-run: clears and re-inserts menu_items.

delete from menu_items;

-- Kopi & Teh
insert into menu_items (name, description, price, category, tags, variant_options, sort_order) values
('Kopi O', 'Kopi tubruk hitam, gula aren.', 8000, 'kopi_teh', '{}',
  '[{"name": "Jenis Kopi", "options": [{"label": "Kopi Tubruk"}, {"label": "Kopi Saring"}]}]'::jsonb, 1),
('Kopi Susu Tjoa', 'Ratio yang sama sejak 1968.', 12000, 'kopi_teh', '{signature}',
  '[{"name": "Jenis Kopi", "options": [{"label": "Kopi Tubruk"}, {"label": "Kopi Saring"}]}]'::jsonb, 2),
('Kopi Tarik', 'Ditarik, berbusa, manis pas.', 13000, 'kopi_teh', '{}', null, 3),
('Teh O', null, 7000, 'kopi_teh', '{}', null, 4),
('Teh Tarik', null, 10000, 'kopi_teh', '{}', null, 5),
('Es Kopi Susu', 'Versi dingin Kopi Susu Tjoa.', 14000, 'kopi_teh', '{}', null, 6);

-- Roti & Kaya
insert into menu_items (name, description, price, category, tags, sort_order) values
('Roti Bakar Srikaya', 'Dipanggang arang, kaya buatan sendiri.', 12000, 'roti_kaya', '{best_seller}', 1),
('Roti Bakar Coklat Keju', null, 13000, 'roti_kaya', '{}', 2),
('Roti Bakar Original', 'Mentega, gula pasir.', 10000, 'roti_kaya', '{}', 3);

-- Telur
insert into menu_items (name, description, price, category, tags, sort_order) values
('Telur Setengah Matang', 'Dua butir, kecap manis, lada putih.', 8000, 'telur', '{}', 1);

-- Snacks / Kueh
insert into menu_items (name, description, price, category, tags, sort_order) values
('Kueh Lapis', 'Per potong.', 6000, 'snacks_kueh', '{}', 1),
('Pisang Goreng', 'Tiga potong.', 9000, 'snacks_kueh', '{}', 2),
('Kacang Tanah Rebus', null, 5000, 'snacks_kueh', '{}', 3);

-- Combo Sets
insert into menu_items (name, description, price, category, tags, sort_order) values
('Set Klasik', 'Kopi Susu Tjoa + Roti Bakar Srikaya + Telur Setengah Matang. Hemat Rp 4.000.', 28000, 'combo_sets', '{signature}', 1),
('Set Ringan', 'Teh Tarik + Roti Bakar Original.', 18000, 'combo_sets', '{}', 2),
('Set Pagi', 'Kopi O + Telur Setengah Matang + Kueh Lapis.', 20000, 'combo_sets', '{}', 3);
