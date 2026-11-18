export function ft(value: number) {
  return `${new Intl.NumberFormat("hu-HU").format(value)} Ft`;
}

export const company = {
  name: "GyurMó Kerítés Kft.",
  phone: "+36 70 417 7156",
  phoneHref: "tel:+36704177156",
  jobPhone: "+36 70 611 6314",
  jobPhoneHref: "tel:+36706116314",
  email: "info@gyurmokerites.hu",
  emailHref: "mailto:info@gyurmokerites.hu",
  facebook: "https://www.facebook.com/profile.php?id=100031055662540",
  workshop: "Szeged, Délép ipari telep",
  address: "6728 Szeged, Budapesti út 8.",
  area: "Csongrád megye, és távolabbról is",
  mapQuery: "Délép Ipari Park, Budapesti út 8, Szeged",
};
