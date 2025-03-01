-- Script pour nettoyer les tables redondantes dans la base de données

-- Vérifier si les tables existent avant de les supprimer
DO $$
BEGIN
    -- Supprimer la table cart_item si elle existe (nous gardons cart_items)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_item') THEN
        DROP TABLE cart_item CASCADE;
        RAISE NOTICE 'Table cart_item supprimée';
    ELSE
        RAISE NOTICE 'Table cart_item n''existe pas';
    END IF;

    -- Supprimer la table product si elle existe (nous gardons products)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product') THEN
        DROP TABLE product CASCADE;
        RAISE NOTICE 'Table product supprimée';
    ELSE
        RAISE NOTICE 'Table product n''existe pas';
    END IF;

    -- Supprimer la table user si elle existe (nous gardons users)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user') THEN
        DROP TABLE "user" CASCADE;
        RAISE NOTICE 'Table user supprimée';
    ELSE
        RAISE NOTICE 'Table user n''existe pas';
    END IF;
END $$;

-- Afficher les tables restantes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name; 