PGDMP     *                
    z            d2e4b66k60vnkc "   12.12 (Ubuntu 12.12-1.pgdg20.04+1)    14.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    200713    d2e4b66k60vnkc    DATABASE     c   CREATE DATABASE d2e4b66k60vnkc WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE d2e4b66k60vnkc;
                bffhvkybeuoyxl    false            �           0    0    DATABASE d2e4b66k60vnkc    ACL     A   REVOKE CONNECT,TEMPORARY ON DATABASE d2e4b66k60vnkc FROM PUBLIC;
                   bffhvkybeuoyxl    false    3972            �           0    0    d2e4b66k60vnkc    DATABASE PROPERTIES     R   ALTER DATABASE d2e4b66k60vnkc SET search_path TO '$user', 'public', 'heroku_ext';
                     bffhvkybeuoyxl    false                        2615    584850 
   heroku_ext    SCHEMA        CREATE SCHEMA heroku_ext;
    DROP SCHEMA heroku_ext;
                postgres    false            �           0    0    SCHEMA heroku_ext    ACL     F   GRANT USAGE ON SCHEMA heroku_ext TO bffhvkybeuoyxl WITH GRANT OPTION;
                   postgres    false    7                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                bffhvkybeuoyxl    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   bffhvkybeuoyxl    false    3            �           0    0    SCHEMA public    ACL     �   REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO bffhvkybeuoyxl;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   bffhvkybeuoyxl    false    3            �           0    0    LANGUAGE plpgsql    ACL     1   GRANT ALL ON LANGUAGE plpgsql TO bffhvkybeuoyxl;
                   postgres    false    640            �            1259    204026    recipenest_recipes    TABLE       CREATE TABLE public.recipenest_recipes (
    id integer NOT NULL,
    recipe_name text NOT NULL,
    url text NOT NULL,
    description text,
    notes text,
    img_url text,
    date_created timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);
 &   DROP TABLE public.recipenest_recipes;
       public         heap    bffhvkybeuoyxl    false    3            �            1259    204033    recipenest_recipes_id_seq    SEQUENCE     �   ALTER TABLE public.recipenest_recipes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.recipenest_recipes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          bffhvkybeuoyxl    false    203    3            �            1259    204035    recipenest_users    TABLE     �   CREATE TABLE public.recipenest_users (
    id integer NOT NULL,
    full_name text NOT NULL,
    user_name text NOT NULL,
    password text NOT NULL,
    nickname text,
    date_created timestamp with time zone DEFAULT now() NOT NULL
);
 $   DROP TABLE public.recipenest_users;
       public         heap    bffhvkybeuoyxl    false    3            �            1259    204042    recipenest_users_id_seq    SEQUENCE     �   ALTER TABLE public.recipenest_users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.recipenest_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          bffhvkybeuoyxl    false    205    3            �            1259    204044    schemaversion    TABLE     �   CREATE TABLE public.schemaversion (
    version bigint NOT NULL,
    name text,
    md5 text,
    run_at timestamp with time zone
);
 !   DROP TABLE public.schemaversion;
       public         heap    bffhvkybeuoyxl    false    3            z          0    204026    recipenest_recipes 
   TABLE DATA           v   COPY public.recipenest_recipes (id, recipe_name, url, description, notes, img_url, date_created, user_id) FROM stdin;
    public          bffhvkybeuoyxl    false    203            |          0    204035    recipenest_users 
   TABLE DATA           f   COPY public.recipenest_users (id, full_name, user_name, password, nickname, date_created) FROM stdin;
    public          bffhvkybeuoyxl    false    205            ~          0    204044    schemaversion 
   TABLE DATA           C   COPY public.schemaversion (version, name, md5, run_at) FROM stdin;
    public          bffhvkybeuoyxl    false    207            �           0    0    recipenest_recipes_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.recipenest_recipes_id_seq', 32, true);
          public          bffhvkybeuoyxl    false    204            �           0    0    recipenest_users_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.recipenest_users_id_seq', 12, true);
          public          bffhvkybeuoyxl    false    206            �           2606    204051 *   recipenest_recipes recipenest_recipes_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.recipenest_recipes
    ADD CONSTRAINT recipenest_recipes_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.recipenest_recipes DROP CONSTRAINT recipenest_recipes_pkey;
       public            bffhvkybeuoyxl    false    203            �           2606    204053 &   recipenest_users recipenest_users_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.recipenest_users
    ADD CONSTRAINT recipenest_users_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.recipenest_users DROP CONSTRAINT recipenest_users_pkey;
       public            bffhvkybeuoyxl    false    205            �           2606    204055 /   recipenest_users recipenest_users_user_name_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.recipenest_users
    ADD CONSTRAINT recipenest_users_user_name_key UNIQUE (user_name);
 Y   ALTER TABLE ONLY public.recipenest_users DROP CONSTRAINT recipenest_users_user_name_key;
       public            bffhvkybeuoyxl    false    205            �           2606    204057     schemaversion schemaversion_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.schemaversion
    ADD CONSTRAINT schemaversion_pkey PRIMARY KEY (version);
 J   ALTER TABLE ONLY public.schemaversion DROP CONSTRAINT schemaversion_pkey;
       public            bffhvkybeuoyxl    false    207            �           2606    204058 2   recipenest_recipes recipenest_recipes_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.recipenest_recipes
    ADD CONSTRAINT recipenest_recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.recipenest_users(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.recipenest_recipes DROP CONSTRAINT recipenest_recipes_user_id_fkey;
       public          bffhvkybeuoyxl    false    3830    205    203            z   �  x��UMo�8=˿��� %�òE֛f4�`m��!@@K�̚"����C�v� iOlà43ｙy���6���Fj���s�]����w�^��V��ԭ?�;n�:����v�a��%���#���$GLU�3{$�n�BڑK)��;g����R+(�¾��U6�#Z��<���}��<#_��㰢E�_Y+W4�����$B4_��2��"�i:�-�:��M'+�h-$`2�s�vLJ{�6��6G�]oG4v
��)��0�&����޵O'ԫ]_�ܤ�"���y�+ѷ+�K��xbuoJ��Ԟ�u����dm�D�V�~���xu�ZP�b��j���Hrk��3?^��#ˎ�������a��'��Y#|���k��2�H2�'��`�Dy��&���Y_���މ��DqvLr��谽�U@����tR��p��}��3��z���
]�=��k�;N��嵂�׃�s��t�Lc���l1q�Q��XO�<[�E��ߢ�/;qJ�n����<\Ⰱ8���ىu�zh����vq�n�;�6�E������h���6���J�4��0/�O]�E]'1+���]��)��e�r�͓�h��A�9.�4'�<�i~����� کLa G��>h��fDR��q9��������BF�J�瓟�|���0��d�������s#�u��%M�iJ`0����, ��C�u#��y������>�J�e:'y�w̃Jf4�n5�ז�ھVh����Ǖ�����ӖU;8�}6=�uť(��_YǛ	���?o��7�-^��l��x{��k��Q�_Eo�O���"�/ғQ�������N�����v�����/�<EQ�!�HLi��#$:K�53F;�f�z���p������x
;����a߸����L��8uᏳ�h'�ZE�Fp�ܒG5z�y��L���v��>y7�h`O�hP�^���}�EcgSs�l6����      |   !  x�U�ɒ�@�5~��u��ĸ� A@��ޠ2Z���(_ߖCE���V��͋�~�v��N���q8�@�cM�V�a�~��\�l����Uyv�H!�^�'�7^4��7Ǵ���0ĨQ�@I*RT((*�@��\�f��y:�uN��>66�/�e�Q�?U�B�1 ^��L��t>�ZmE�q��B<"*�U,Q���P�[����"M�5�zΧ�I����7$��Ԇl}d�S�5EWS3HD�,��˴���L�W:܅��H�X�`(+��CR�O�?�:a�TF���z�q�z�R*�zB:Ν�|��U7�PN�eo���^��F"Y%��@
!��D������x�^�g�g�ۋ��ZH��)R��S1��*
�� �Co���rx�����7UTJ����p�!�*���[瓫�x�n�|��flҚ�D3�Y��@X�5�i�2h�!FV�Uܬϒ��8�C��HD&P�s����\}�n�/��{��=붮�Il�ˬ@��a��s$�J��r=8�6�wza��%�*����B(�[A������K      ~   �   x�m�=
�0@��>E�� �?�s�� lY�.����ے5��7}`�ǙuF��]�����[ǾC�0�7nP[xf�J���)J�� ���Mn�H�9E�X�P�F2�<A8Մ�0��䕅r&�v���u��~V2�     