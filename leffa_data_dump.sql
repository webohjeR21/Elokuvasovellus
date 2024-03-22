--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: leffa_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO leffa_user;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: lisaa_jasen_ryhmaan(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.lisaa_jasen_ryhmaan(IN p_rnimi character varying, IN p_jasen character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM ryhmat WHERE rnimi = p_rnimi) THEN
        IF p_jasen = ANY(SELECT unnest(jasenet) FROM ryhmat WHERE rnimi = p_rnimi) THEN
            RAISE EXCEPTION 'Asiakas % on jo ryhmassa %.', p_jasen, p_rnimi;
        ELSIF (SELECT omistaja FROM ryhmat WHERE rnimi = p_rnimi) = p_jasen THEN
            RAISE EXCEPTION 'Asiakas % on jo ryhmassa %.', p_jasen, p_rnimi;
        ELSE
            UPDATE ryhmat
            SET jasenet = array_append(jasenet, p_jasen)
            WHERE rnimi = p_rnimi;
            RAISE NOTICE 'Asiakas % lisattiin ryhmaan %.', p_jasen, p_rnimi;
        END IF;
    ELSE
        RAISE EXCEPTION 'Ryhmaa % ei ole olemassa.', p_rnimi;
    END IF;
END;
$$;


ALTER PROCEDURE public.lisaa_jasen_ryhmaan(IN p_rnimi character varying, IN p_jasen character varying) OWNER TO leffa_user;

--
-- Name: luo_asiakas(character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.luo_asiakas(IN p_uname character varying, IN p_passwd character varying, IN p_email character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM asiakkaat WHERE uname = p_uname) THEN
        RAISE EXCEPTION 'Asiakas on jo olemassa.';
    ELSIF EXISTS (SELECT 1 FROM asiakkaat WHERE email = p_email) THEN
        RAISE EXCEPTION 'Sähköposti on jo käytössä.';
    ELSE
        INSERT INTO asiakkaat (uname, create_time, passwd, email)
        VALUES (p_uname, CURRENT_TIMESTAMP, digest(p_passwd, 'sha256'), p_email);
    END IF;
END;
$$;


ALTER PROCEDURE public.luo_asiakas(IN p_uname character varying, IN p_passwd character varying, IN p_email character varying) OWNER TO leffa_user;

--
-- Name: luo_ryhma(character varying, character varying, character varying[], character varying); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.luo_ryhma(IN p_rnimi character varying, IN p_omistaja character varying, IN p_jasenet character varying[], IN p_kuvaus character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM ryhmat WHERE rnimi = p_rnimi) THEN
        RAISE EXCEPTION 'Ryhma % on jo olemassa.', p_rnimi;
    ELSE
        INSERT INTO ryhmat (rnimi, omistaja, jasenet, create_time, kuvaus)
        VALUES (p_rnimi, p_omistaja, p_jasenet, current_timestamp, p_kuvaus);
        RAISE NOTICE 'Ryhma % luotu onnistuneesti.', p_rnimi;
    END IF;
END;
$$;


ALTER PROCEDURE public.luo_ryhma(IN p_rnimi character varying, IN p_omistaja character varying, IN p_jasenet character varying[], IN p_kuvaus character varying) OWNER TO leffa_user;

--
-- Name: muuta_ryhma_kuvaus(character varying, text); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.muuta_ryhma_kuvaus(IN p_rnimi character varying, IN p_kuvaus text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE ryhmat
    SET kuvaus = p_kuvaus
    WHERE rnimi = p_rnimi;
END;
$$;


ALTER PROCEDURE public.muuta_ryhma_kuvaus(IN p_rnimi character varying, IN p_kuvaus text) OWNER TO leffa_user;

--
-- Name: poista_asiakas(character varying); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.poista_asiakas(IN p_uname character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if the username exists
    IF EXISTS (SELECT 1 FROM asiakkaat WHERE uname = p_uname) THEN
        -- Delete the user if it exists
        DELETE FROM asiakkaat WHERE uname = p_uname;
        RAISE NOTICE 'Asiakas % poistettu.', p_uname;
    ELSE
        RAISE EXCEPTION 'Asiakasta % ei ole olemassa.', p_uname;
    END IF;
END;
$$;


ALTER PROCEDURE public.poista_asiakas(IN p_uname character varying) OWNER TO leffa_user;

--
-- Name: poista_jasen_ryhmasta(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.poista_jasen_ryhmasta(IN p_rnimi character varying, IN p_jasen character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM ryhmat WHERE rnimi = p_rnimi) THEN
        UPDATE ryhmat
        SET jasenet = array_remove(jasenet, p_jasen)
        WHERE rnimi = p_rnimi;
        RAISE NOTICE 'Asiakas % poistettu ryhmasta %.', p_jasen, p_rnimi;
    ELSE
        RAISE EXCEPTION 'Ryhmaa % ei ole olemassa.', p_rnimi;
    END IF;
END;
$$;


ALTER PROCEDURE public.poista_jasen_ryhmasta(IN p_rnimi character varying, IN p_jasen character varying) OWNER TO leffa_user;

--
-- Name: poista_ryhma(character varying); Type: PROCEDURE; Schema: public; Owner: leffa_user
--

CREATE PROCEDURE public.poista_ryhma(IN p_rnimi character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM ryhmat WHERE rnimi = p_rnimi) THEN
        DELETE FROM ryhmat WHERE rnimi = p_rnimi;
        RAISE NOTICE 'Ryhma % poistettu.', p_rnimi;
    ELSE
        RAISE EXCEPTION 'Ryhmaa % ei ole olemassa.', p_rnimi;
    END IF;
END;
$$;


ALTER PROCEDURE public.poista_ryhma(IN p_rnimi character varying) OWNER TO leffa_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asiakkaat; Type: TABLE; Schema: public; Owner: leffa_user
--

CREATE TABLE public.asiakkaat (
    uname character varying(15) NOT NULL,
    create_time date,
    passwd character varying(255),
    email character varying(255)
);


ALTER TABLE public.asiakkaat OWNER TO leffa_user;

--
-- Name: ryhmat; Type: TABLE; Schema: public; Owner: leffa_user
--

CREATE TABLE public.ryhmat (
    rnimi character varying(15) NOT NULL,
    omistaja character varying(15),
    jasenet character varying(15)[],
    create_time date,
    kuvaus text
);


ALTER TABLE public.ryhmat OWNER TO leffa_user;

--
-- Data for Name: asiakkaat; Type: TABLE DATA; Schema: public; Owner: leffa_user
--

COPY public.asiakkaat (uname, create_time, passwd, email) FROM stdin;
Janne42	2024-03-21	\\x8567f9cd1ed2fea5f85eadd21f7f137f683767660bb67827db2e882dca5d5471	jannemoney@paskakasa.fi
Liisamaikkula	2024-03-21	\\x578e857a04d62edd82a792c8773f36c4aea65d0c86a6e852b9c7f4c0249410d6	liisaboss@paskakasa.fi
tarmosami	2024-03-21	\\x578e857a04d62edd82a792c8773f36c4aea65d0c86a6e852b9c7f4c0249410d6	tarmosami@paskakasa.fi
IsoKALERVO	2024-03-21	\\x294cfb471a24649bb8691f83d32838830ed5a43e3da010552a235550ea850645	kalervo@paskakasa.fi
SAMULI	2024-03-22	\\x294cfb471a24649bb8691f83d32838830ed5a43e3da010552a235550ea850645	SAMULI@paskakasa.fi
\.


--
-- Data for Name: ryhmat; Type: TABLE DATA; Schema: public; Owner: leffa_user
--

COPY public.ryhmat (rnimi, omistaja, jasenet, create_time, kuvaus) FROM stdin;
Supopeatsamit	Janne42	{Liisamaikkula,tarmosami,IsoKALERVO}	2024-03-21	\N
Kovikset	Janne42	{Liisamaikkula,tarmosami,IsoKALERVO}	2024-03-21	Hiton kovia jatkia vain
Leffapojat	Liisamaikkula	{tarmosami,IsoKALERVO}	2024-03-21	Pojat tykkaa leffoista
Samulinjamit	SAMULI	{tarmosami,IsoKALERVO}	2024-03-22	Samulin leffakerho
\.


--
-- Name: asiakkaat asiakkaat_pkey; Type: CONSTRAINT; Schema: public; Owner: leffa_user
--

ALTER TABLE ONLY public.asiakkaat
    ADD CONSTRAINT asiakkaat_pkey PRIMARY KEY (uname);


--
-- Name: ryhmat ryhmat_pkey; Type: CONSTRAINT; Schema: public; Owner: leffa_user
--

ALTER TABLE ONLY public.ryhmat
    ADD CONSTRAINT ryhmat_pkey PRIMARY KEY (rnimi);


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.armor(bytea) TO leffa_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.armor(bytea, text[], text[]) TO leffa_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.crypt(text, text) TO leffa_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dearmor(text) TO leffa_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrypt(bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.digest(bytea, text) TO leffa_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.digest(text, text) TO leffa_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.encrypt(bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_random_bytes(integer) TO leffa_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_random_uuid() TO leffa_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_salt(text) TO leffa_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gen_salt(text, integer) TO leffa_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.hmac(bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.hmac(text, text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text) TO leffa_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_key_id(bytea) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) TO leffa_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) TO leffa_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) TO leffa_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO leffa_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO leffa_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO leffa_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO leffa_user;


--
-- PostgreSQL database dump complete
--

