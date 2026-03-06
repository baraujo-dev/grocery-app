--
-- PostgreSQL database dump
--

CREATE TABLE grocery_items (
    id uuid NOT NULL,
    added_at timestamp(6) with time zone,
    completed_at timestamp(6) with time zone,
    name character varying(255),
    grocery_list_id uuid NOT NULL
);

CREATE TABLE grocery_lists (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone,
    name character varying(255),
    owner_id uuid
);

CREATE TABLE users (
    id uuid NOT NULL,
    password_hash character varying(255) NOT NULL,
    username character varying(255) NOT NULL
);

ALTER TABLE ONLY grocery_items
    ADD CONSTRAINT grocery_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY grocery_lists
    ADD CONSTRAINT grocery_lists_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY grocery_items
    ADD CONSTRAINT fkacmh6byd0en35d0d7y0uaq4m1 FOREIGN KEY (grocery_list_id) REFERENCES public.grocery_lists(id);

ALTER TABLE ONLY grocery_lists
    ADD CONSTRAINT fkruqb3m0qso9axmoljnqqfv175 FOREIGN KEY (owner_id) REFERENCES public.users(id);
