drop database if exists inemaps;
create database inemaps;
 
CREATE TABLE IF NOT EXISTS public.categoria
(
    idcategoria serial NOT NULL,
    descripcion character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categoria_pkey PRIMARY KEY (idcategoria)
);

ALTER TABLE IF EXISTS public.categoria
    OWNER to postgres;
      
CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    name character varying(60) COLLATE pg_catalog."default" NOT NULL,
    email character varying(75) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
    

   
CREATE TABLE IF NOT EXISTS public.posts
(
    idpost serial NOT NULL,
    titlepost character varying(280) COLLATE pg_catalog."default" NOT NULL,
    fechapublicacion date NOT NULL,
    descripcion character varying(280) COLLATE pg_catalog."default" NOT NULL,
    idcategoria serial NOT NULL,
    codigoestudiante serial NOT NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (idpost),
    CONSTRAINT "fk_codigoEstudiantePosts" FOREIGN KEY (codigoestudiante)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "fk_idCategoriaCategoria" FOREIGN KEY (idcategoria)
        REFERENCES public.categoria (idcategoria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
ALTER TABLE IF EXISTS public.posts
    OWNER to postgres;
	
	
	
CREATE TABLE IF NOT EXISTS public.comentarios
(
    idcomentario serial NOT NULL,
    descripcion character varying(280) COLLATE pg_catalog."default" NOT NULL,
    fechapublicacion date NOT NULL,
    codigoestudiante serial NOT NULL,
    idpost serial NOT NULL,
    CONSTRAINT comentarios_pkey PRIMARY KEY (idcomentario),
    CONSTRAINT "fk_estudiantesComentarios" FOREIGN KEY (codigoestudiante)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "fk_idPostPosts" FOREIGN KEY (idpost)
        REFERENCES public.posts (idpost) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
ALTER TABLE IF EXISTS public.comentarios
    OWNER to postgres;
