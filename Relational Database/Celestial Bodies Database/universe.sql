--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)

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

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(30) NOT NULL,
    diameter_by_kpc integer,
    age_by_billion_years numeric(5,2),
    color text,
    observable_from_earth boolean
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_galaxy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_galaxy_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_galaxy_id_seq OWNED BY public.galaxy.galaxy_id;


--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    name character varying(30) NOT NULL,
    orbital_radius_by_km integer,
    planet_id integer,
    galaxy_id integer,
    star_id integer,
    radius_by_km integer
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.moon_moon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moon_moon_id_seq OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.moon_moon_id_seq OWNED BY public.moon.moon_id;


--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    name character varying(30) NOT NULL,
    radius_by_km integer,
    age_by_billion_years numeric(5,2),
    star_id integer,
    galaxy_id integer,
    is_habitable boolean,
    color text,
    observable_from_earth boolean
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_planet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_planet_id_seq OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_planet_id_seq OWNED BY public.planet.planet_id;


--
-- Name: satellite; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.satellite (
    satellite_id integer NOT NULL,
    active boolean,
    name character varying(30) NOT NULL
);


ALTER TABLE public.satellite OWNER TO freecodecamp;

--
-- Name: satellite_satellite_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.satellite_satellite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.satellite_satellite_id_seq OWNER TO freecodecamp;

--
-- Name: satellite_satellite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.satellite_satellite_id_seq OWNED BY public.satellite.satellite_id;


--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    name character varying(30) NOT NULL,
    radius_by_km integer,
    age_by_billion_years numeric(5,2),
    galaxy_id integer,
    color text,
    observable_from_earth boolean
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_star_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_star_id_seq OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_star_id_seq OWNED BY public.star.star_id;


--
-- Name: galaxy galaxy_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy ALTER COLUMN galaxy_id SET DEFAULT nextval('public.galaxy_galaxy_id_seq'::regclass);


--
-- Name: moon moon_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon ALTER COLUMN moon_id SET DEFAULT nextval('public.moon_moon_id_seq'::regclass);


--
-- Name: planet planet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet ALTER COLUMN planet_id SET DEFAULT nextval('public.planet_planet_id_seq'::regclass);


--
-- Name: satellite satellite_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.satellite ALTER COLUMN satellite_id SET DEFAULT nextval('public.satellite_satellite_id_seq'::regclass);


--
-- Name: star star_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star ALTER COLUMN star_id SET DEFAULT nextval('public.star_star_id_seq'::regclass);


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (1, 'Milky Way', 30, 13.61, 'White', true);
INSERT INTO public.galaxy VALUES (2, 'Andromeda', 47, 10.01, 'Grey', true);
INSERT INTO public.galaxy VALUES (3, 'Cygnus A', 166, NULL, NULL, true);
INSERT INTO public.galaxy VALUES (4, 'Messier 87', 41, 13.24, 'Blue', true);
INSERT INTO public.galaxy VALUES (5, 'Messier 104', 15, 13.25, 'White', true);
INSERT INTO public.galaxy VALUES (6, 'Canis Major Dwarf', 3, NULL, 'Light Blue', true);


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (1, 'Earth''s Moon', 385000, 1, 1, 1, 1737);
INSERT INTO public.moon VALUES (2, 'Io', 422000, 5, 1, 1, 1822);
INSERT INTO public.moon VALUES (3, 'Europa', 670900, 5, 1, 1, 1561);
INSERT INTO public.moon VALUES (4, 'Ganymede', 1070000, 5, 1, 1, 26341);
INSERT INTO public.moon VALUES (5, 'Deimos', 23640, 2, 1, 1, 6);
INSERT INTO public.moon VALUES (6, 'Phobos', 6000, 2, 1, 1, 11);
INSERT INTO public.moon VALUES (7, 'Enceladus', 237948, 6, 1, 1, 252);
INSERT INTO public.moon VALUES (8, 'Titan', 1221870, 6, 1, 1, 2574);
INSERT INTO public.moon VALUES (9, 'Ariel', 190900, 7, 1, 1, 579);
INSERT INTO public.moon VALUES (10, 'Oberon', 583520, 7, 1, 1, 761);
INSERT INTO public.moon VALUES (11, 'Triton', 354759, 8, 1, 1, 1353);
INSERT INTO public.moon VALUES (12, 'Charon', 19640, NULL, 1, NULL, 606);
INSERT INTO public.moon VALUES (13, 'Hydra', 64721, NULL, 1, NULL, 45);
INSERT INTO public.moon VALUES (14, 'Kerberos', 58000, NULL, 1, NULL, 9);
INSERT INTO public.moon VALUES (15, 'Nix', 48694, NULL, 1, NULL, 25);
INSERT INTO public.moon VALUES (16, 'Atlas', 137670, 6, 1, 1, 15);
INSERT INTO public.moon VALUES (17, 'Anthe', 197700, 6, 1, 1, 1);
INSERT INTO public.moon VALUES (18, 'Dione', 377400, 6, 1, 1, 561);
INSERT INTO public.moon VALUES (19, 'Epimetheus', 151410, 6, 1, 1, 58);
INSERT INTO public.moon VALUES (20, 'Cressida', 61766, 6, 1, 1, 39);


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (1, 'Earth', 6378, 4.54, 1, 1, true, 'Blue', true);
INSERT INTO public.planet VALUES (2, 'Mars', 3390, 4.60, 1, 1, false, 'Red', true);
INSERT INTO public.planet VALUES (3, 'Mercury', 2439, 4.50, 1, 1, false, 'Slate Grey', true);
INSERT INTO public.planet VALUES (4, 'Venus', 6051, 4.50, 1, 1, false, 'Yellow-White', true);
INSERT INTO public.planet VALUES (5, 'Jupiter', 69911, 4.60, 1, 1, false, 'Brown', true);
INSERT INTO public.planet VALUES (6, 'Saturn', 58232, 4.50, 1, 1, false, 'Yellow-Brown', true);
INSERT INTO public.planet VALUES (7, 'Uranus', 25362, 4.50, 1, 1, false, 'Blue-Green', true);
INSERT INTO public.planet VALUES (8, 'Neptune', 24622, 4.50, 1, 1, false, 'Blue', true);
INSERT INTO public.planet VALUES (9, 'Keppler-296e', 11149, NULL, NULL, NULL, true, NULL, false);
INSERT INTO public.planet VALUES (10, 'TRAPPIST-1d', 4995, 7.60, NULL, NULL, true, NULL, false);
INSERT INTO public.planet VALUES (11, 'Proxima Centauri b', NULL, 4.85, NULL, NULL, true, 'Red', false);
INSERT INTO public.planet VALUES (12, 'Luyten b', 8601, NULL, NULL, NULL, true, NULL, false);


--
-- Data for Name: satellite; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.satellite VALUES (1, false, 'Sputnik 1');
INSERT INTO public.satellite VALUES (2, true, 'Aqua');
INSERT INTO public.satellite VALUES (3, true, 'Terra');


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (1, 'Sun', 696340, 4.60, 1, 'White', true);
INSERT INTO public.star VALUES (2, 'UY Scuti', 1188300000, NULL, 1, 'Red', true);
INSERT INTO public.star VALUES (3, 'S Persei', NULL, 0.15, 1, 'Red', false);
INSERT INTO public.star VALUES (4, 'Alpha Andromedae', NULL, 0.06, 2, 'Blue', true);
INSERT INTO public.star VALUES (5, 'Beta Andromedae', 69570000, NULL, 2, 'Red', false);
INSERT INTO public.star VALUES (6, 'Albireo', NULL, 0.10, 3, 'Yellowish Red', true);


--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_galaxy_id_seq', 6, true);


--
-- Name: moon_moon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.moon_moon_id_seq', 33, true);


--
-- Name: planet_planet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_planet_id_seq', 33, true);


--
-- Name: satellite_satellite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.satellite_satellite_id_seq', 3, true);


--
-- Name: star_star_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_star_id_seq', 6, true);


--
-- Name: galaxy galaxy_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_name_key UNIQUE (name);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: moon moon_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key UNIQUE (name);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_name_key UNIQUE (name);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: satellite satellite_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.satellite
    ADD CONSTRAINT satellite_name_key UNIQUE (name);


--
-- Name: satellite satellite_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.satellite
    ADD CONSTRAINT satellite_pkey PRIMARY KEY (satellite_id);


--
-- Name: star star_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_name_key UNIQUE (name);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: star galaxy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT galaxy_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- Name: planet galaxy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT galaxy_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- Name: moon galaxy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT galaxy_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- Name: moon planet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT planet_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet star_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT star_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: moon star_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT star_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- PostgreSQL database dump complete
--

