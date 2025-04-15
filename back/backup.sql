--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Ubuntu 15.3-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg20.04+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: gamerchallenge
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO gamerchallenge;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: gamerchallenge
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: RefreshTokens; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public."RefreshTokens" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token character varying(255) NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."RefreshTokens" OWNER TO gamerchallenge;

--
-- Name: RefreshTokens_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public."RefreshTokens_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."RefreshTokens_id_seq" OWNER TO gamerchallenge;

--
-- Name: RefreshTokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public."RefreshTokens_id_seq" OWNED BY public."RefreshTokens".id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    pseudo character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    score_global integer DEFAULT 0 NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    refresh_token character varying(255),
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.accounts OWNER TO gamerchallenge;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO gamerchallenge;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: badges; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.badges (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    "imageUrl" character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.badges OWNER TO gamerchallenge;

--
-- Name: badges_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.badges_id_seq OWNER TO gamerchallenge;

--
-- Name: badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.badges_id_seq OWNED BY public.badges.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO gamerchallenge;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO gamerchallenge;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: challenges; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.challenges (
    id integer NOT NULL,
    game_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    rules text NOT NULL,
    type character varying(50) NOT NULL,
    image_url character varying(255) DEFAULT 'default'::character varying,
    account_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.challenges OWNER TO gamerchallenge;

--
-- Name: challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.challenges_id_seq OWNER TO gamerchallenge;

--
-- Name: challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.challenges_id_seq OWNED BY public.challenges.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.comments (
    challenge_id integer NOT NULL,
    account_id integer NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO gamerchallenge;

--
-- Name: games; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.games (
    id integer NOT NULL,
    thumbnail character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    genre character varying(50) NOT NULL,
    game_url character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.games OWNER TO gamerchallenge;

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_id_seq OWNER TO gamerchallenge;

--
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- Name: participations; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.participations (
    id integer NOT NULL,
    challenge_id integer NOT NULL,
    video_url character varying(255),
    image_url character varying(255),
    score integer DEFAULT 0,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    account_id integer
);


ALTER TABLE public.participations OWNER TO gamerchallenge;

--
-- Name: participations_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.participations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.participations_id_seq OWNER TO gamerchallenge;

--
-- Name: participations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.participations_id_seq OWNED BY public.participations.id;


--
-- Name: receives; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.receives (
    id integer NOT NULL,
    account_id integer NOT NULL,
    badge_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.receives OWNER TO gamerchallenge;

--
-- Name: receives_id_seq; Type: SEQUENCE; Schema: public; Owner: gamerchallenge
--

CREATE SEQUENCE public.receives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.receives_id_seq OWNER TO gamerchallenge;

--
-- Name: receives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gamerchallenge
--

ALTER SEQUENCE public.receives_id_seq OWNED BY public.receives.id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: gamerchallenge
--

CREATE TABLE public.votes (
    account_id integer NOT NULL,
    participation_id integer NOT NULL,
    vote integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.votes OWNER TO gamerchallenge;

--
-- Name: RefreshTokens id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public."RefreshTokens" ALTER COLUMN id SET DEFAULT nextval('public."RefreshTokens_id_seq"'::regclass);


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: badges id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.badges ALTER COLUMN id SET DEFAULT nextval('public.badges_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: challenges id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.challenges ALTER COLUMN id SET DEFAULT nextval('public.challenges_id_seq'::regclass);


--
-- Name: games id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- Name: participations id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.participations ALTER COLUMN id SET DEFAULT nextval('public.participations_id_seq'::regclass);


--
-- Name: receives id; Type: DEFAULT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.receives ALTER COLUMN id SET DEFAULT nextval('public.receives_id_seq'::regclass);


--
-- Data for Name: RefreshTokens; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public."RefreshTokens" (id, "userId", token, "expiresAt", created_at, updated_at) FROM stdin;
1	7	479756d3ac54a8323432d65bae99101393377b9339668f0c083e5490dea22c10	2025-04-14 19:54:04.433+02	2025-03-15 18:54:04.436+01	2025-03-15 18:54:04.436+01
2	8	ce97fc65df3ab8af1e9b147e9a62a5c33e12833ab229f266e711e418f1c06da3	2025-04-14 20:38:52.93+02	2025-03-15 19:38:52.939+01	2025-03-15 19:38:52.939+01
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.accounts (id, pseudo, email, password, score_global, role, is_active, refresh_token, description, created_at, updated_at) FROM stdin;
1	ShadowX	player1@example.com	hashedpassword1	5	user	t	\N	\N	2025-03-15 18:53:05.883+01	2025-03-15 18:53:05.883+01
2	CyberWolf	player2@example.com	hashedpassword2	10	user	t	\N	\N	2025-03-15 18:53:05.883+01	2025-03-15 18:53:05.883+01
3	NeonBlade	player3@example.com	hashedpassword3	20	user	t	\N	\N	2025-03-15 18:53:05.883+01	2025-03-15 18:53:05.883+01
4	DarkOverlord	player4@example.com	hashedpassword4	25	admin	t	\N	\N	2025-03-15 18:53:05.883+01	2025-03-15 18:53:05.883+01
5	StormBreaker	player5@example.com	hashedpassword5	15	user	t	\N	\N	2025-03-15 18:53:05.883+01	2025-03-15 18:53:05.883+01
6	VoidSpectre	player6@example.com	hashedpassword6	30	user	t	\N	\N	2025-03-15 18:53:05.883+01	2025-03-15 18:53:05.883+01
7	demo 	demo@localhost.com	$argon2id$v=19$m=65536,t=3,p=4$zwyuBPJ49EWmB/JkE4hvUw$t/8k+rvDDJijAyf6fQOPIyBDWSka5hmAKky1STrY1rs	0	user	t	\N	une petite démo rien que pour vous!	2025-03-15 18:54:04.413+01	2025-03-15 18:54:04.413+01
8	test2	testee2@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$aqT0vxRWFmp0NBnW+KmcDA$WiPqp7fH/gwW6zQxYoNpXzWkSN0Z5X6ZKQdA6X5DdJA	0	user	t	\N	zzzz	2025-03-15 19:38:52.896+01	2025-03-15 19:38:52.896+01
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.badges (id, name, description, "imageUrl", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.categories (id, name, description, created_at, updated_at) FROM stdin;
1	Solo	Les défis Solo mettent à l'épreuve vos compétences individuelles. Ces challenges vous invitent à explorer, créer et repousser vos limites en résolvant des énigmes complexes ou en réalisant des exploits personnels. C'est l'occasion de montrer votre créativité, votre persévérance et votre capacité à réussir en solo.	2025-03-15 18:53:05.863+01	2025-03-15 18:53:05.863+01
2	Competitive	Les défis Compétitifs sont conçus pour tester votre esprit de compétition et votre stratégie. Engagez-vous dans des affrontements intenses contre d'autres joueurs, mesurez votre talent et grimpez dans les classements. Ces challenges exigent rapidité, précision et une excellente gestion du stress pour atteindre la victoire.	2025-03-15 18:53:05.863+01	2025-03-15 18:53:05.863+01
3	Team	Les défis d'Équipe reposent sur la collaboration et l'esprit d'équipe. Dans ces challenges, vous devez travailler main dans la main avec d'autres joueurs pour surmonter des obstacles, élaborer des stratégies communes et atteindre des objectifs collectifs. Ils renforcent la communication, la coordination et la solidarité au sein du groupe.	2025-03-15 18:53:05.863+01	2025-03-15 18:53:05.863+01
4	Adventure	Les défis d'Aventure demandent exploration et résolution de mystères. Partez à la découverte d'univers fantastiques, trouvez des trésors cachés, et vivez des aventures épiques.	2025-03-15 18:53:05.863+01	2025-03-15 18:53:05.863+01
5	Strategy	Les défis Stratégiques mettent à l'épreuve votre esprit tactique. Prenez des décisions cruciales et faites face à des situations complexes pour surmonter vos adversaires.	2025-03-15 18:53:05.863+01	2025-03-15 18:53:05.863+01
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.challenges (id, game_id, title, description, rules, type, image_url, account_id, category_id, created_at, updated_at) FROM stdin;
1	1	Kingdom Come	Plongez dans un RPG médiéval réaliste où chaque choix influence votre destin. Menez des combats intenses, maîtrisez l'artisanat et explorez un monde ouvert historiquement fidèle.	Utilisez uniquement les mécaniques du jeu, pas de mods de triche. Respectez les autres joueurs en mode multijoueur et suivez les objectifs du défi.	Solo	https://cdn.akamai.steamstatic.com/steam/apps/379430/header.jpg	1	1	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
2	2	Conquest of Westeros	Join a competitive match against others. Win the game to become the champion!	Respect other players, no toxic behavior.	Competitive	https://www.jeuxnavigateur.com/images/thumbnails/game-of-thrones-winter-is-coming.jpg	2	2	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
3	3	Tactical Warfare	Dominate the battlefield with your reflexes and sharp mind!	Fair play, no team killing.	Team	https://cdn.akamai.steamstatic.com/steam/apps/582660/header.jpg	3	3	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
4	4	Ultimate Showdown	Compete against others in this thrilling sports challenge!	Follow the rules of the game, no cheating.	Competitive	https://cdn.akamai.steamstatic.com/steam/apps/678960/header.jpg	4	2	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
5	5	Mind Hack	Solve mind-bending puzzles in a world of mystery and intrigue.	Think outside the box, no cheating.	Solo	https://bigmedia.bpifrance.fr/sites/default/files/styles/bigmedia_article/public/2022-03/mario.jpg?itok=h5P6EMjR	5	4	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
6	6	Galactic Conquest	Engage in intense space battles and come out on top!	Play fair, no exploits.	Competitive	https://www.journaldugeek.com/app/uploads/2023/03/mariobros.jpg	6	5	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
7	1	Choice of Destiny	Make impactful decisions in this adventure and see how they shape the world!	No spoilers, enjoy the journey.	Solo	https://img.lemde.fr/2019/08/20/0/0/920/518/700/0/75/0/d7e78e6_woe19_sh8WPFx8vvPbljt8-O.png	1	1	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
8	2	Strategic Domination	Form alliances and outsmart your opponents to claim victory!	Work together, but beware of betrayals.	Team	https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg	2	2	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
9	3	Beat Battle	Compete in rhythm challenges and show off your musical skills!	Stay in the rhythm, no pausing!	Competitive	https://cdn.akamai.steamstatic.com/steam/apps/620980/header.jpg	3	3	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
10	4	Survive the Night	Escape from terrifying creatures and survive until dawn!	Keep quiet, no flashlight use.	Solo	https://cdn.akamai.steamstatic.com/steam/apps/418370/header.jpg	4	4	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
11	5	Treasure Hunter	Explore the world to find hidden treasures and complete quests!	Respect the environment, no cheating.	Solo	https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg	5	5	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
12	6	Speed Racer	Race against others and claim the title of the fastest racer!	No shortcuts, play fair.	Competitive	https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg	6	2	2025-03-15 18:53:05.911+01	2025-03-15 18:53:05.911+01
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.comments (challenge_id, account_id, text, created_at, updated_at) FROM stdin;
1	1	Great challenge!	2025-03-15 18:53:05.967+01	2025-03-15 18:53:05.967+01
2	2	I love this concept!	2025-03-15 18:53:05.967+01	2025-03-15 18:53:05.967+01
3	3	This was such a fun challenge!	2025-03-15 18:53:05.967+01	2025-03-15 18:53:05.967+01
4	4	What an amazing sports challenge!	2025-03-15 18:53:05.967+01	2025-03-15 18:53:05.967+01
5	5	Mind-blowing puzzles!	2025-03-15 18:53:05.967+01	2025-03-15 18:53:05.967+01
6	6	Space battles are intense!	2025-03-15 18:53:05.967+01	2025-03-15 18:53:05.967+01
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.games (id, thumbnail, title, description, genre, game_url, created_at, updated_at) FROM stdin;
1	https://www.freetogame.com/g/523/thumbnail.jpg	Jeu 1_fallguys	A thrilling adventure game where every decision impacts the world. Explore vast environments and solve challenging puzzles.	Action	https://www.freetogame.com/open/fall-guys	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
2	https://www.freetogame.com/g/508/thumbnail.jpg	Jeu 2_enlisted	An immersive RPG with an epic storyline, travel through various realms and uncover hidden secrets.	RPG	https://www.freetogame.com/open/enlisted	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
3	https://www.freetogame.com/g/582/thumbnail.jpg	Jeu 3_tarisland	A fast-paced competitive game where strategy and quick reflexes are key to victory.	Shooter	https://www.freetogame.com/open/tarisland	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
4	https://www.freetogame.com/g/14/thumbnail.jpg	Jeu 4_Star Trek Online	A free-to-play, 3D, Sci-Fi MMORPG based on the popular Star Trek series.	MMORPG	https://www.freetogame.com/open/star-trek-online	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
5	https://www.freetogame.com/g/472/thumbnail.jpg	Jeu 5_Jade Goddess	Jade Goddess is a free-to-play, browser based MMO inspired by Eastern mythology.	Puzzle	https://www.freetogame.com/open/jade-goddess	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
6	https://www.freetogame.com/g/255/thumbnail.jpg	Jeu 6_Stronghold Kingdoms	A sci-fi space shooter with intense dogfights and exploration.	Shooter	https://www.freetogame.com/open/stronghold-kingdoms	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
7	https://www.freetogame.com/g/350/thumbnail.jpg	Jeu 7_Goodgame Empire	A free to play medieval strategy browser game. Build you own castle and create a powerful army! 	Adventure	https://www.freetogame.com/open/goodgame-empire	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
8	https://www.freetogame.com/g/466/thumbnail.jpg	Jeu 8_Valorant	Test your mettle in Riot Games’ character-based FPS shooter Valorant.	Strategy	https://www.freetogame.com/open/valorant	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
9	https://www.freetogame.com/g/573/thumbnail.jpg	Jeu 9_Titan Revenge	A 3D Norse-themed browser MMORPG developed and published by Game Hollywood Games	Rhythm	https://www.freetogame.com/open/titan-revenge	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
10	https://www.freetogame.com/g/529/thumbnail.jpg	Jeu 10_Tower of Fantasy	Tower of Fantasy is a 3D open-world RPG, anime-style sci-fi MMO RPG game with unique characters and beautiful open vistas!	Horror	https://www.freetogame.com/open/tower-of-fantasy	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
11	https://www.freetogame.com/g/594/thumbnail.jpg	Jeu 11_Stalcraft: X	A free-to-play MMOFPS set in an open-world.	Open World	https://www.freetogame.com/open/stalcraft-x	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
12	https://www.freetogame.com/g/230/thumbnail.jpg	Jeu 12_Ragnarok Online 2	A 3D fantasy MMORPG, and sequel to the popular Ragnarok Online.	Racing	https://www.freetogame.com/open/ragnarok-online-2	2025-03-15 18:53:05.899+01	2025-03-15 18:53:05.899+01
\.


--
-- Data for Name: participations; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.participations (id, challenge_id, video_url, image_url, score, description, created_at, updated_at, account_id) FROM stdin;
1	1	https://www.youtube.com/watch?v=mSSEWE1vCSg	\N	10	Successfully completed the challenge!	2025-03-15 18:53:05.948+01	2025-03-15 18:53:05.948+01	1
2	2	https://www.youtube.com/watch?v=6nKREX6YeCY	\N	20	An incredible participation!	2025-03-15 18:53:05.948+01	2025-03-15 18:53:05.948+01	2
3	3	https://www.youtube.com/watch?v=e3tKswNLFjc	\N	15	Teamwork made this challenge fun!	2025-03-15 18:53:05.948+01	2025-03-15 18:53:05.948+01	3
4	4	https://www.youtube.com/watch?v=e3tKswNLFjc	\N	18	What a challenge!	2025-03-15 18:53:05.948+01	2025-03-15 18:53:05.948+01	4
5	5	https://www.youtube.com/watch?v=e3tKswNLFjc	\N	17	Puzzle solved!	2025-03-15 18:53:05.948+01	2025-03-15 18:53:05.948+01	5
6	6	https://www.youtube.com/watch?v=e3tKswNLFjc	\N	22	Victory in space!	2025-03-15 18:53:05.948+01	2025-03-15 18:53:05.948+01	6
\.


--
-- Data for Name: receives; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.receives (id, account_id, badge_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: gamerchallenge
--

COPY public.votes (account_id, participation_id, vote, created_at, updated_at) FROM stdin;
1	2	5	2025-03-15 18:53:05.957+01	2025-03-15 18:53:05.957+01
2	3	4	2025-03-15 18:53:05.957+01	2025-03-15 18:53:05.957+01
3	4	3	2025-03-15 18:53:05.957+01	2025-03-15 18:53:05.957+01
4	1	4	2025-03-15 18:53:05.957+01	2025-03-15 18:53:05.957+01
5	5	5	2025-03-15 18:53:05.957+01	2025-03-15 18:53:05.957+01
6	6	5	2025-03-15 18:53:05.957+01	2025-03-15 18:53:05.957+01
\.


--
-- Name: RefreshTokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public."RefreshTokens_id_seq"', 2, true);


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.accounts_id_seq', 8, true);


--
-- Name: badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.badges_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.challenges_id_seq', 12, true);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.games_id_seq', 12, true);


--
-- Name: participations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.participations_id_seq', 6, true);


--
-- Name: receives_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gamerchallenge
--

SELECT pg_catalog.setval('public.receives_id_seq', 1, false);


--
-- Name: RefreshTokens RefreshTokens_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY (id);


--
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- Name: accounts accounts_email_key1; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key1 UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pseudo_key; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pseudo_key UNIQUE (pseudo);


--
-- Name: accounts accounts_pseudo_key1; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pseudo_key1 UNIQUE (pseudo);


--
-- Name: badges badges_name_key; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_name_key UNIQUE (name);


--
-- Name: badges badges_name_key1; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_name_key1 UNIQUE (name);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_name_key1; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key1 UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (challenge_id, account_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: games games_title_key; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_title_key UNIQUE (title);


--
-- Name: games games_title_key1; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_title_key1 UNIQUE (title);


--
-- Name: participations participations_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_pkey PRIMARY KEY (id);


--
-- Name: receives receives_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.receives
    ADD CONSTRAINT receives_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (account_id, participation_id);


--
-- Name: RefreshTokens RefreshTokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "RefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: challenges challenges_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: challenges challenges_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: challenges challenges_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participations participations_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: participations participations_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.participations
    ADD CONSTRAINT participations_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: receives receives_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.receives
    ADD CONSTRAINT receives_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: receives receives_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.receives
    ADD CONSTRAINT receives_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_participation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gamerchallenge
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_participation_id_fkey FOREIGN KEY (participation_id) REFERENCES public.participations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: gamerchallenge
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

