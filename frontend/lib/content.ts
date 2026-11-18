export type Work = {
  slug: string;
  title: string;
  body: string;
  images: [string, string, string];
  product?: string;
};

function photos(slug: string): [string, string, string] {
  return [`/munkaink/${slug}/1.jpg`, `/munkaink/${slug}/2.jpg`, `/munkaink/${slug}/3.jpg`];
}

export const works: Work[] = [
  {
    slug: "wpc-keritesek",
    title: "WPC kerítések",
    product: "szemelybejaro",
    body: "A WPC mező fa hatású, és nem kér festést. A váz marad acél, a borítás a lamellákban van. Kerítésnek és a hozzá tartozó személybejárónak ugyanabból az anyagból készül a mezője, így a kapu nem idegen test a vonalban.",
    images: photos("wpc-keritesek"),
  },
  {
    slug: "wpc-terasz",
    title: "WPC teraszburkolat",
    body: "A teraszburkolat ugyanabból a családba tartozó anyagból készül, mint a WPC kerítés. A műhely a fogadószerkezetet és a burkolást együtt viszi, ha a kerítéssel egy munkában kérik.",
    images: photos("wpc-terasz"),
  },
  {
    slug: "uszokapuk",
    title: "Úszókapuk",
    product: "uszokapu",
    body: "Az úszókapu konzolosan fut, a behajtóban nincs sín. A szárny a saját pályáján mozog, ezért a murva, a hó és a kocsiút nem akadály. A képek megvalósult szárnyak, a rendelhető három méret ugyanezt a szerkezetet követi.",
    images: photos("uszokapuk"),
  },
  {
    slug: "trapezlemez",
    title: "Trapézlemez kerítés",
    body: "A trapézlemez zárt, gyorsan szerelhető mező. Oszlop, váztartó és lemez egy rendszer. Ott használjuk, ahol a telekhatárt takarni kell, és a karbantartás kevés lehet.",
    images: photos("trapezlemez"),
  },
  {
    slug: "rozsdamentes-korlatok",
    title: "Rozsdamentes korlátok",
    body: "Lépcsőre, erkélyre és előtető mellé rozsdamentes korlát készül, beltérre és kültérre. A csomópontokat a műhelyben hegesztjük, a helyszínen a fogadóhoz igazítjuk.",
    images: photos("rozsdamentes-korlatok"),
  },
  {
    slug: "nivo-aluminium",
    title: "Nívó alumínium kerítés",
    product: "szemelybejaro",
    body: "A Nívó alumínium rendszer lamellás, könnyű és festés nélkül tartja a színét. A személybejáró és a nagyobb kapu ugyanabból a profilból épül, ezért a kerítés egy vonal marad.",
    images: photos("nivo-aluminium"),
  },
  {
    slug: "nivo-acel",
    title: "Nívó acél kerítés",
    product: "tolokapu",
    body: "A Nívó acél változat nehezebb, zártabb mező. Porszórt felülettel készül. A toló- és úszókapu váza ugyanehhez a ritmushoz igazítható.",
    images: photos("nivo-acel"),
  },
  {
    slug: "kulteri-tuzlepcso",
    title: "Kültéri tűzlépcső",
    body: "Ipari és társasházi lépcsők, ahol a statika és a járófelület együtt számít. A tervezést mérnök partnerekkel végezzük, a gyártás és a helyszíni szerelés a műhelyé.",
    images: photos("kulteri-tuzlepcso"),
  },
  {
    slug: "kovacsoltvas",
    title: "Kovácsoltvas kerítés és kapu",
    product: "ketszarnyu",
    body: "A kovácsoltvas munkák egyedi rajzra készülnek: kerítésmező, kétszárnyú kapu, személybejáró. A minta a megrendelőé, a szerkezet és a zárás a műhely felelőssége.",
    images: photos("kovacsoltvas"),
  },
  {
    slug: "korlatok",
    title: "Korlátok",
    body: "Előtető alatti, lépcső menti és teraszra kerülő korlátok. Acélból és rozsdamentesből, a ház meglévő anyagához igazítva. A rögzítés a fogadó falhoz vagy a lépcsőkarhoz készül.",
    images: photos("korlatok"),
  },
  {
    slug: "komuvesmunkak",
    title: "Kőművesmunkák",
    body: "A kapu és a kerítés gyakran lábazatot, oszlopot, alapot kér. Ezeket a műhely a fémszerkezettel együtt vállalja, hogy a fogadó és a szárny egy ütemben készüljön el.",
    images: photos("komuvesmunkak"),
  },
  {
    slug: "csarnok-garazs",
    title: "Csarnok, garázs",
    body: "Vázszerkezet műhelyhez, csarnokhoz és garázshoz. A gyártás a szegedi telepen történik, a szerelés a helyszínen. Kis és nagyobb fesztáv is belefér, statikai tervvel, ha a méret kéri.",
    images: photos("csarnok-garazs"),
  },
  {
    slug: "lakatos",
    title: "Lakatosmunkák",
    body: "Ami nem fér a kész kapuk közé: egyedi vasalat, javítás, pótmező, gépelem. Nincs minimum mennyiség. Ha a hét kapacitása engedi, a kisebb munkát is beütemezzük.",
    images: photos("lakatos"),
  },
  {
    slug: "deszkazott",
    title: "Deszkázott kerítés",
    body: "Fa betétes mező acél vázzal. A deszka cserélhető, a váz marad. Kapuval együtt készül, hogy a személybejáró és a kerítésmező egy magasságban fusson.",
    images: photos("deszkazott"),
  },
  {
    slug: "beton-elemes",
    title: "Beton elemes kerítés",
    body: "Beton elemes kerítés ott, ahol a telekhatárnak tömörnek és gyorsan építhetőnek kell lennie. Az oszlopokat és a mezőket a helyszínhez igazítjuk, a kapu fogadóját előre bekötjük.",
    images: photos("beton-elemes"),
  },
  {
    slug: "3d-kerites",
    title: "3D táblás kerítés",
    body: "A 3D táblás kerítés vékony, áttört, és gyorsan szerelhető. Ipari telekre és lakóingatlanra is készül, kapuval és anélkül. A tábla a kész rendszer, az oszlop és a kapu a helyszíné.",
    images: photos("3d-kerites"),
  },
  {
    slug: "autobeallo",
    title: "Autóbeálló",
    body: "Autóbeállók, féltetők és terasztetők, rozsdamentes vagy porszórt acél vázzal. A tető a házhoz vagy szabadon álló oszlopokra kerül. A bontástól a fedésig egy munkában is kérhető.",
    images: photos("autobeallo"),
  },
  {
    slug: "lezervagott",
    title: "Lézervágott kerítés és kapu",
    product: "uszokapu",
    body: "A minta lézervágott lemezből készül, a fény átesik rajta, a telek mégis zárt. Úszókapun és fix mezőn ugyanaz a rajz futhat. Egyedi minta egyeztetéssel, a kész méretű kapukra a katalógus ára vonatkozik.",
    images: photos("lezervagott"),
  },
];

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug);
}

export const services = [
  {
    icon: "kerites",
    title: "Kerítések",
    text: "Teljes kivitelezés, akár gondozásmentes anyagból. A kapu a kerítéssel együtt készül.",
  },
  {
    icon: "garazs",
    title: "Garázs, autóbeálló",
    text: "Autóbeállók, féltetők, terasztetők és tárolók. Rozsdamentes anyaggal is.",
  },
  {
    icon: "general",
    title: "Generálkivitelezés",
    text: "A régi elbontásától az új felépítéséig a teljes folyamat egy kézben marad.",
  },
  {
    icon: "auto",
    title: "Automatizálás",
    text: "Garázs- és kertkapu mozgatás. WiFi-s vagy RFID vezérléssel is kiegészíthető.",
  },
  {
    icon: "lakatos",
    title: "Lakatosmunka",
    text: "Fémszerkezet, úszókapu, kovácsoltvas, egyedi vasalat.",
  },
  {
    icon: "lepcso",
    title: "Lépcső, korlát",
    text: "Beltérre és kültérre, a fogadó szerkezethez igazítva.",
  },
  {
    icon: "vaz",
    title: "Vázszerkezet, csarnok",
    text: "Műhely és csarnok váza, a gyártástól a szerelésig.",
  },
  {
    icon: "egyedi",
    title: "Egyedi gyártás",
    text: "Gépet és alkatrészt is megtervezünk, mérnök partnerekkel, majd legyártjuk.",
  },
] as const;

export const values = [
  { title: "Minőség", text: "A minőség a mennyiség előtt áll. Olyan munkát adunk ki, amit magunknak is elvégeznénk." },
  { title: "Rugalmasság", text: "Az ügyféllel együtt keressük a megoldást. Ami a rajzon nem áll meg, azt a helyszínen újra lehet gondolni." },
  { title: "Teljes kör", text: "Már a bontást is ránk lehet bízni. Tervezés, anyag, gyártás, szerelés." },
];

export const about = [
  "A csapat több mint 15 éve foglalkozik szerkezetgyártással. 2022-ben ebből lett a GyurMó Kerítés Kft.",
  "Alapvetően Csongrád megyében dolgozunk, és várjuk a megkeresést az ország távolabbi pontjairól is.",
  "A megbízhatóság a tervezésnél kezdődik: anyagválasztás, a tényleges munka, és a határidő. Mind a háromra figyelünk.",
  "A konkrét problémára keressük a megoldást, nem egy kész sablont hozunk a telekre.",
];

export const faqs = [
  {
    q: "Egyedi megrendelést is vállaltok?",
    a: "Igen. Több mérnökkel dolgozunk, az alkatrész megtervezését és a statikát is rájuk lehet bízni. Az ügyféllel együtt keressük, mi fér el a helyszínen és a költségben.",
  },
  {
    q: "Van minimum munkamennyiség?",
    a: "Nincs. A kisebb munkát is elvállaljuk, ha a hét kapacitása engedi.",
  },
  {
    q: "Hogyan rendeljek?",
    a: "A négy kaputípus a kész méreteivel azonnal rögzíthető, és lefoglal egy műhelyhetet. Telefonon és emailen is el lehet indulni. Ha a helyszín kéri, kimegyünk felmérni, utána egy összegű ajánlat készül.",
  },
  {
    q: "Mi a legfontosabb a munkában?",
    a: "A precizitás. Olyan munkát adunk ki a kezünkből, amit magunknak is elvégeznénk.",
  },
  {
    q: "Miért van ár a kapukon, és miért nincs minden másra?",
    a: "A személybejáró, a kétszárnyú, a toló- és az úszókapu három-három kész méretben irányárral rendelhető. Ami felmérést kér, arra továbbra is egyedi ajánlat készül: lépcső, csarnok, kovácsoltvas, egyedi nyílás.",
  },
  {
    q: "Van garancia?",
    a: "Igen, az elvégzett munkára. Profi csavarral és anyaggal dolgozunk. Ha állítás vagy javítás kell, szólni kell, és megoldjuk.",
  },
];

export const quotes = [
  {
    text: "Nagyon rendes és profi csapatot ismerhettem meg. A kerítést hibátlanul felépítették, látszott, hogy a minőség náluk kiemelkedő szempont. Maximálisan elégedett vagyok.",
    name: "Zoltán",
  },
  {
    text: "A várólista kicsit hosszú volt, de megérte. Rugalmasak voltak, és nyitottak az elképzeléseimre. Volt, amit nem jól gondoltam, pont ezért bízza az ember szakemberre.",
    name: "Gábor",
  },
  {
    text: "Az autóbeállóm a megbeszéltek szerint elkészült. A kovácsoltvas kapura várni kellett, érthető okból, de az eredmény magáért beszél.",
    name: "István",
  },
];

export const partners = [
  { name: "Nívó", src: "/partnerek/nivo.png" },
  { name: "Kano", src: "/partnerek/kano.png" },
  { name: "Párkányos", src: "/partnerek/parkanyos.png" },
  { name: "WPC Market", src: "/partnerek/wpc.png" },
];

export const furniture = [
  {
    title: "Bárszett",
    place: "Beltér",
    kind: "Design",
    image: "/munkaink/butorok/1.jpg",
    body: "Acél váz, tölgy hatású lap. Asztal és két különböző magasságú ülőke, egy rajzra. A bemutatóteremben áll, rendelésre ugyanez a szerkezet készül.",
  },
  {
    title: "Állóasztal",
    place: "Beltér",
    kind: "Funkcionális",
    image: "/munkaink/butorok/2.jpg",
    body: "Egy lábon álló asztal, lábtartóval. Műhely, iroda vagy pult mellé. A magasság és a lap mérete egyeztethető.",
  },
  {
    title: "Bárszék",
    place: "Beltér",
    kind: "Design",
    image: "/munkaink/butorok/3.jpg",
    body: "Háttámlás szék a szettből, külön is. A váz porszórt acél, az ülőlap és a hátlap fa. Kültéri darabok ugyanebbe a listába kerülnek, ha a sorozat bővül.",
  },
];

export const career = {
  title: "Munkalehetőség",
  body: "Építőiparban és lakatos iparban jártas munkavállalót keresünk, elsősorban kerítésépítésre és a hozzá tartozó lakatosmunkára. Ha beleillik egy fiatal, mozgékony csapatba, várjuk a jelentkezést.",
  contact: "Érdeklődni a lenti számon, Facebookon, vagy az űrlapon lehet.",
};
