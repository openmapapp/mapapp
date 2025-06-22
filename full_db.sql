--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ItemStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ItemStatus" AS ENUM (
    'PRESENT',
    'DEPARTED',
    'UNKNOWN'
);


ALTER TYPE public."ItemStatus" OWNER TO postgres;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'ACTIVE',
    'CONFIRMED',
    'DISPUTED',
    'RESOLVED',
    'INCORRECT'
);


ALTER TYPE public."ReportStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'user',
    'moderator',
    'admin'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    published boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "authorId" text NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: GlobalSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GlobalSettings" (
    id integer NOT NULL,
    "mapCenterLat" double precision DEFAULT 40.730610 NOT NULL,
    "mapCenterLng" double precision DEFAULT '-73.935242'::numeric NOT NULL,
    "mapBoundsSwLat" double precision,
    "mapBoundsSwLng" double precision,
    "mapBoundsNeLat" double precision,
    "mapBoundsNeLng" double precision,
    "mapZoom" integer DEFAULT 12 NOT NULL,
    "mapZoomMin" integer DEFAULT 10 NOT NULL,
    "mapZoomMax" integer DEFAULT 18 NOT NULL,
    "mapApiKey" text,
    "mapOpenToVisitors" boolean DEFAULT true NOT NULL,
    "submitReportsOpen" boolean DEFAULT false NOT NULL,
    "registrationMode" text DEFAULT 'open'::text NOT NULL,
    "verifyPermission" text DEFAULT 'admin'::text NOT NULL,
    "aboutContent" text,
    "blogEnabled" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."GlobalSettings" OWNER TO postgres;

--
-- Name: GlobalSettings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GlobalSettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GlobalSettings_id_seq" OWNER TO postgres;

--
-- Name: GlobalSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GlobalSettings_id_seq" OWNED BY public."GlobalSettings".id;


--
-- Name: InviteCode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InviteCode" (
    id text NOT NULL,
    code text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "usedBy" text,
    "isUsed" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."InviteCode" OWNER TO postgres;

--
-- Name: Report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Report" (
    id integer NOT NULL,
    "reportTypeId" integer NOT NULL,
    lat double precision NOT NULL,
    long double precision NOT NULL,
    description jsonb,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "isPermanent" boolean DEFAULT false NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "reportStatus" public."ReportStatus" DEFAULT 'ACTIVE'::public."ReportStatus" NOT NULL,
    "verifiedAt" timestamp(3) without time zone,
    "verifiedById" text,
    "itemStatus" public."ItemStatus" DEFAULT 'PRESENT'::public."ItemStatus" NOT NULL,
    "departedAt" timestamp(3) without time zone,
    "departureReportedById" text,
    "trustScore" integer NOT NULL,
    "confirmationCount" integer DEFAULT 0 NOT NULL,
    "disconfirmationCount" integer DEFAULT 0 NOT NULL,
    "isVisible" boolean DEFAULT true NOT NULL,
    "submittedById" text,
    "deletedUserId" text
);


ALTER TABLE public."Report" OWNER TO postgres;

--
-- Name: ReportStatusChange; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReportStatusChange" (
    id integer NOT NULL,
    "reportId" integer NOT NULL,
    "previousStatus" public."ReportStatus" NOT NULL,
    "newStatus" public."ReportStatus" NOT NULL,
    "previousItemStatus" public."ItemStatus" NOT NULL,
    "newItemStatus" public."ItemStatus" NOT NULL,
    "changedById" text,
    "deletedUserId" text,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReportStatusChange" OWNER TO postgres;

--
-- Name: ReportStatusChange_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ReportStatusChange_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReportStatusChange_id_seq" OWNER TO postgres;

--
-- Name: ReportStatusChange_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ReportStatusChange_id_seq" OWNED BY public."ReportStatusChange".id;


--
-- Name: ReportType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReportType" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    fields text NOT NULL,
    "iconUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."ReportType" OWNER TO postgres;

--
-- Name: ReportType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ReportType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReportType_id_seq" OWNER TO postgres;

--
-- Name: ReportType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ReportType_id_seq" OWNED BY public."ReportType".id;


--
-- Name: Report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Report_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Report_id_seq" OWNER TO postgres;

--
-- Name: Report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Report_id_seq" OWNED BY public."Report".id;


--
-- Name: Vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vote" (
    id integer NOT NULL,
    value integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text,
    "reportId" integer NOT NULL
);


ALTER TABLE public."Vote" OWNER TO postgres;

--
-- Name: Vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vote_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vote_id_seq" OWNER TO postgres;

--
-- Name: Vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vote_id_seq" OWNED BY public."Vote".id;


--
-- Name: _BlogPostToCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BlogPostToCategory" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BlogPostToCategory" OWNER TO postgres;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(6) without time zone,
    "refreshTokenExpiresAt" timestamp(6) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(6) without time zone NOT NULL,
    "updatedAt" timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(6) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(6) without time zone NOT NULL,
    "updatedAt" timestamp(6) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    role public."Role" DEFAULT 'user'::public."Role" NOT NULL,
    "createdAt" timestamp(6) without time zone NOT NULL,
    "updatedAt" timestamp(6) without time zone NOT NULL,
    username text,
    "displayUsername" text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(6) without time zone NOT NULL,
    "createdAt" timestamp(6) without time zone,
    "updatedAt" timestamp(6) without time zone
);


ALTER TABLE public.verification OWNER TO postgres;

--
-- Name: GlobalSettings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GlobalSettings" ALTER COLUMN id SET DEFAULT nextval('public."GlobalSettings_id_seq"'::regclass);


--
-- Name: Report id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Report" ALTER COLUMN id SET DEFAULT nextval('public."Report_id_seq"'::regclass);


--
-- Name: ReportStatusChange id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportStatusChange" ALTER COLUMN id SET DEFAULT nextval('public."ReportStatusChange_id_seq"'::regclass);


--
-- Name: ReportType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportType" ALTER COLUMN id SET DEFAULT nextval('public."ReportType_id_seq"'::regclass);


--
-- Name: Vote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote" ALTER COLUMN id SET DEFAULT nextval('public."Vote_id_seq"'::regclass);


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, title, slug, content, excerpt, published, "createdAt", "updatedAt", "publishedAt", "authorId") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, slug) FROM stdin;
\.


--
-- Data for Name: GlobalSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GlobalSettings" (id, "mapCenterLat", "mapCenterLng", "mapBoundsSwLat", "mapBoundsSwLng", "mapBoundsNeLat", "mapBoundsNeLng", "mapZoom", "mapZoomMin", "mapZoomMax", "mapApiKey", "mapOpenToVisitors", "submitReportsOpen", "registrationMode", "verifyPermission", "aboutContent", "blogEnabled") FROM stdin;
1	33.89930079404138	-118.2226821579962	33.6794187373621	-118.8110580552955	34.11643782973162	-117.6343062606969	9	7	16	oMl1mvJaNTHSkt73s8WA	t	f	open	admin	\N	f
\.


--
-- Data for Name: InviteCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InviteCode" (id, code, "createdAt", "expiresAt", "usedBy", "isUsed") FROM stdin;
\.


--
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Report" (id, "reportTypeId", lat, long, description, image, "createdAt", "updatedAt", "isPermanent", "expiresAt", "reportStatus", "verifiedAt", "verifiedById", "itemStatus", "departedAt", "departureReportedById", "trustScore", "confirmationCount", "disconfirmationCount", "isVisible", "submittedById", "deletedUserId") FROM stdin;
1	1	33.89820825185652	-118.2226821579962	{}	\N	2025-06-22 21:12:45.884	2025-06-22 21:12:45.884	f	\N	ACTIVE	\N	\N	PRESENT	\N	\N	1	0	0	t	e0bm1Og5j02OaydI8D7x91rajb3QsAAA	\N
\.


--
-- Data for Name: ReportStatusChange; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReportStatusChange" (id, "reportId", "previousStatus", "newStatus", "previousItemStatus", "newItemStatus", "changedById", "deletedUserId", reason, "createdAt") FROM stdin;
\.


--
-- Data for Name: ReportType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReportType" (id, name, description, fields, "iconUrl", "createdAt", "updatedAt") FROM stdin;
1	ICE	ICE raid	[{"id":"fa4683d9-a238-4884-8bb0-813169feea4f","name":"size","label":"Size","type":"number","required":false,"order":0},{"id":"db7f05a7-233e-438d-a34c-124e2ffdc852","name":"activity","label":"Activity","type":"text","required":false,"order":1},{"id":"7d656612-76a8-4808-bb5b-47c6fa5a790d","name":"unit","label":"Unit","type":"text","required":false,"order":2},{"id":"a7e32555-a821-4aba-8039-82bab193bd3d","name":"equipment","label":"Equipment","type":"text","required":false,"order":3}]	/uploads/icons/57b87bc6-618b-4f7d-b341-0799089503af.png	2025-06-22 21:11:44.747	2025-06-22 21:11:44.747
2	Gas	Tear gas or other chemical weapons	[{"id":"3f2d8a94-3501-48f9-9bbf-468a4371ac9d","name":"description","label":"Description","type":"text","required":false,"order":0}]	/uploads/icons/1cb562c5-e146-44f0-a3fd-3065a5020080.png 	2025-06-22 21:11:44.756	2025-06-22 21:11:44.756
3	Roadblock		[{"id":"dba28de5-ef6d-486d-84ae-0f206384549d","name":"unit","label":"Unit","type":"text","required":false,"order":0},{"id":"6232a395-a9ce-4adf-840f-e57528c063f0","name":"activity","label":"Activity","type":"text","required":false,"order":1}]	/uploads/icons/1ca53608-fe3b-4f5e-ba58-f8f83f58b73d.png	2025-06-22 21:11:44.757	2025-06-22 21:11:44.757
\.


--
-- Data for Name: Vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vote" (id, value, "createdAt", "userId", "reportId") FROM stdin;
\.


--
-- Data for Name: _BlogPostToCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogPostToCategory" ("A", "B") FROM stdin;
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
VQuXze6owfg8IYrjdyf1Lz3fZv5kWgJq	e0bm1Og5j02OaydI8D7x91rajb3QsAAA	credential	e0bm1Og5j02OaydI8D7x91rajb3QsAAA	\N	\N	\N	\N	\N	\N	04b735ef9704a2dd08078f50eb544bd1:c73d3c2b177a3fd7aae4ee273e05fbd2fdac2e948e3f77324dff7b2301a4f9000e32c7ae0ac5bb9d700f27835f5db21064f183a813f207f42c032d8e025d21c8	2025-06-22 16:20:09.216	2025-06-22 16:20:09.216
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
x67P5Ww6pryFp7qfc9uISbbYNOd2bigU	2025-06-29 16:25:06.539	a1bFdAUGO6f1hioX3NMpoFoPxmm7bOe9	2025-06-22 16:25:06.539	2025-06-22 16:25:06.539	::ffff:127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0	e0bm1Og5j02OaydI8D7x91rajb3QsAAA
Fu2JQVprdEsdm0dxAwDWfC06K9A6PQ1s	2025-06-29 16:25:26.136	LI917lppuzcShxLGncGgbJEvOCqY8TWJ	2025-06-22 16:25:26.136	2025-06-22 16:25:26.136	::ffff:127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0	e0bm1Og5j02OaydI8D7x91rajb3QsAAA
5hfNVfvFs2GJEkQNcM92oKXY2b4cuRXh	2025-06-29 17:17:32.741	73PmIPqR3382yUb2M6rWwlGq6d8coImJ	2025-06-22 17:17:32.742	2025-06-22 17:17:32.742	::ffff:127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0	e0bm1Og5j02OaydI8D7x91rajb3QsAAA
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt", username, "displayUsername") FROM stdin;
e0bm1Og5j02OaydI8D7x91rajb3QsAAA	example	test@test.com	f	admin	2025-06-22 16:20:07.332	2025-06-22 16:20:07.332	example	example
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: GlobalSettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GlobalSettings_id_seq"', 1, false);


--
-- Name: ReportStatusChange_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ReportStatusChange_id_seq"', 1, false);


--
-- Name: ReportType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ReportType_id_seq"', 1, false);


--
-- Name: Report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Report_id_seq"', 1, true);


--
-- Name: Vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vote_id_seq"', 1, false);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: GlobalSettings GlobalSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GlobalSettings"
    ADD CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY (id);


--
-- Name: InviteCode InviteCode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InviteCode"
    ADD CONSTRAINT "InviteCode_pkey" PRIMARY KEY (id);


--
-- Name: ReportStatusChange ReportStatusChange_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportStatusChange"
    ADD CONSTRAINT "ReportStatusChange_pkey" PRIMARY KEY (id);


--
-- Name: ReportType ReportType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportType"
    ADD CONSTRAINT "ReportType_pkey" PRIMARY KEY (id);


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- Name: Vote Vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_pkey" PRIMARY KEY (id);


--
-- Name: _BlogPostToCategory _BlogPostToCategory_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToCategory"
    ADD CONSTRAINT "_BlogPostToCategory_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: BlogPost_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_authorId_idx" ON public."BlogPost" USING btree ("authorId");


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: InviteCode_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InviteCode_code_key" ON public."InviteCode" USING btree (code);


--
-- Name: ReportType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ReportType_name_key" ON public."ReportType" USING btree (name);


--
-- Name: Vote_userId_reportId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vote_userId_reportId_key" ON public."Vote" USING btree ("userId", "reportId");


--
-- Name: _BlogPostToCategory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BlogPostToCategory_B_index" ON public."_BlogPostToCategory" USING btree ("B");


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: user_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);


--
-- Name: BlogPost BlogPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReportStatusChange ReportStatusChange_changedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportStatusChange"
    ADD CONSTRAINT "ReportStatusChange_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ReportStatusChange ReportStatusChange_reportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportStatusChange"
    ADD CONSTRAINT "ReportStatusChange_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES public."Report"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Report Report_departureReportedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_departureReportedById_fkey" FOREIGN KEY ("departureReportedById") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Report Report_reportTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES public."ReportType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Report Report_submittedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Report Report_verifiedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Vote Vote_reportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES public."Report"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Vote Vote_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: _BlogPostToCategory _BlogPostToCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToCategory"
    ADD CONSTRAINT "_BlogPostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToCategory _BlogPostToCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToCategory"
    ADD CONSTRAINT "_BlogPostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

