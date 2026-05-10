import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { discountedPrice, formatPrice } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  LogIn,
  MapPin,
  ShoppingBag,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// Indian pincode validation — 6 digits starting with 1-9
const PINCODE_RE = /^[1-9][0-9]{5}$/;
const PHONE_RE = /^(\+91[-\s]?)?[6-9]\d{9}$/;

// Complete Assam pincodes by district
const ASSAM_PINCODES = new Set([
  // Guwahati / Kamrup Metro
  "781001",
  "781002",
  "781003",
  "781004",
  "781005",
  "781006",
  "781007",
  "781008",
  "781009",
  "781010",
  "781011",
  "781012",
  "781013",
  "781014",
  "781017",
  "781018",
  "781019",
  "781020",
  "781021",
  "781022",
  "781023",
  "781024",
  "781025",
  "781026",
  "781027",
  "781028",
  "781029",
  "781030",
  "781031",
  "781032",
  "781035",
  "781036",
  "781037",
  "781038",
  "781040",
  // Kamrup Rural
  "781100",
  "781101",
  "781102",
  "781103",
  "781104",
  "781120",
  "781121",
  "781122",
  "781123",
  "781124",
  "781125",
  "781126",
  "781127",
  "781128",
  "781129",
  "781130",
  "781131",
  "781132",
  "781133",
  "781134",
  "781135",
  "781136",
  "781137",
  "781138",
  "781139",
  "781140",
  "781141",
  "781150",
  // Nalbari
  "781300",
  "781301",
  "781302",
  "781303",
  "781304",
  "781305",
  "781306",
  "781307",
  "781308",
  "781309",
  "781310",
  "781311",
  "781312",
  "781313",
  "781314",
  "781315",
  "781316",
  "781317",
  "781318",
  "781319",
  "781320",
  "781321",
  "781322",
  "781323",
  "781324",
  "781325",
  "781326",
  "781327",
  "781328",
  "781329",
  "781330",
  "781335",
  "781337",
  "781338",
  "781339",
  "781340",
  "781341",
  "781342",
  "781343",
  "781344",
  "781345",
  "781346",
  "781347",
  "781348",
  "781349",
  "781360",
  "781361",
  "781362",
  "781363",
  "781364",
  "781365",
  "781366",
  "781367",
  "781368",
  "781369",
  "781370",
  "781371",
  "781372",
  "781373",
  "781374",
  "781375",
  "781376",
  "781377",
  "781378",
  // Barpeta
  "781351",
  "781352",
  "781353",
  "781354",
  "781355",
  "781356",
  "781357",
  "781358",
  "781359",
  "781380",
  "781381",
  // Nagaon
  "782001",
  "782002",
  "782003",
  "782101",
  "782102",
  "782103",
  "782104",
  "782105",
  "782106",
  "782107",
  "782108",
  "782109",
  "782110",
  "782120",
  "782121",
  "782122",
  "782123",
  "782124",
  "782125",
  "782126",
  "782127",
  "782128",
  "782136",
  "782138",
  "782140",
  "782141",
  "782410",
  "782411",
  "782412",
  "782413",
  "782425",
  "782426",
  "782427",
  "782428",
  "782429",
  "782430",
  "782435",
  "782436",
  // Karbi Anglong
  "782139",
  "782441",
  "782450",
  "782460",
  "782461",
  "782462",
  "782470",
  "782480",
  "782481",
  "782482",
  "782483",
  "782485",
  "782490",
  // Dima Hasao
  "788108",
  "788819",
  "788820",
  "788821",
  "788822",
  "788830",
  "788831",
  "788832",
  "788833",
  "788931",
  // Sonitpur
  "784001",
  "784027",
  "784028",
  "784056",
  "784100",
  "784101",
  "784102",
  "784103",
  "784104",
  "784105",
  "784110",
  "784112",
  "784113",
  "784125",
  "784144",
  "784145",
  "784146",
  "784147",
  "784148",
  "784149",
  "784150",
  "784160",
  "784165",
  "784168",
  "784170",
  "784175",
  "784178",
  "784501",
  "784504",
  "784505",
  "784506",
  "784509",
  "784510",
  "784520",
  "784521",
  "784522",
  "784523",
  "784524",
  "784525",
  "784526",
  "784527",
  "784528",
  "784529",
  // Darrang
  "784025",
  "784114",
  "784115",
  "784116",
  "784117",
  "784118",
  "784119",
  "784120",
  "784121",
  "784122",
  "784130",
  // Udalguri
  "784500",
  "784501",
  "784502",
  "784503",
  "784504",
  "784505",
  "784506",
  "784507",
  "784508",
  "784509",
  "784510",
  "784511",
  "784512",
  "784513",
  "784514",
  "784515",
  "784516",
  // Lakhimpur
  "784161",
  "784162",
  "784163",
  "784164",
  "784166",
  "784167",
  "784169",
  "787001",
  "787023",
  "787026",
  "787028",
  "787029",
  "787030",
  "787031",
  "787032",
  "787033",
  "787034",
  "787035",
  "787051",
  "787053",
  "787054",
  "787055",
  "787056",
  "787057",
  "787058",
  // Dhemaji
  "787027",
  "787059",
  "787060",
  "787061",
  "787062",
  "787063",
  "787064",
  "787065",
  "787110",
  // Jorhat
  "785001",
  "785004",
  "785005",
  "785006",
  "785007",
  "785008",
  "785010",
  "785011",
  "785012",
  "785013",
  "785014",
  "785015",
  "785016",
  "785100",
  "785101",
  "785102",
  "785104",
  "785105",
  "785106",
  "785108",
  "785110",
  "785111",
  "785112",
  "785601",
  "785602",
  "785603",
  "785610",
  "785611",
  "785612",
  "785613",
  "785614",
  "785615",
  "785616",
  "785617",
  "785618",
  "785619",
  "785620",
  "785640",
  "785670",
  "785671",
  "785680",
  "785681",
  "785682",
  "785683",
  "785684",
  "785685",
  "785686",
  "785687",
  "785688",
  "785689",
  "785690",
  "785691",
  "785692",
  "785693",
  "785694",
  "785695",
  "785696",
  "785697",
  "785698",
  "785699",
  "785700",
  "785701",
  "785702",
  "785703",
  "785704",
  // Golaghat
  "785621",
  "785622",
  "785623",
  "785624",
  "785625",
  "785626",
  "785627",
  "785628",
  "785629",
  "785630",
  "785631",
  "785632",
  "785633",
  "785634",
  "785635",
  "785636",
  "785637",
  "785638",
  "785639",
  "785660",
  "785661",
  "785662",
  "785663",
  "785664",
  "785665",
  "785705",
  // Dibrugarh
  "786001",
  "786002",
  "786003",
  "786004",
  "786005",
  "786006",
  "786007",
  "786008",
  "786009",
  "786010",
  "786012",
  "786101",
  "786102",
  "786103",
  "786104",
  "786110",
  "786125",
  "786126",
  "786145",
  "786146",
  "786150",
  "786151",
  "786152",
  "786153",
  "786154",
  "786155",
  "786156",
  "786157",
  "786158",
  "786159",
  "786160",
  "786161",
  "786170",
  "786171",
  "786172",
  "786173",
  "786174",
  "786175",
  "786176",
  "786177",
  "786178",
  "786179",
  "786180",
  "786181",
  "786182",
  "786183",
  "786184",
  "786185",
  "786186",
  "786187",
  "786188",
  "786189",
  "786190",
  "786191",
  "786192",
  "786692",
  // Tinsukia
  "786600",
  "786601",
  "786602",
  "786610",
  "786611",
  "786612",
  "786613",
  "786614",
  "786615",
  "786616",
  "786617",
  "786618",
  "786619",
  "786620",
  "786621",
  "786622",
  "786623",
  "786625",
  "786630",
  // Cachar
  "788001",
  "788002",
  "788003",
  "788004",
  "788005",
  "788006",
  "788007",
  "788008",
  "788009",
  "788010",
  "788011",
  "788012",
  "788013",
  "788014",
  "788015",
  "788019",
  "788020",
  "788021",
  "788022",
  "788023",
  "788024",
  "788025",
  "788026",
  "788027",
  "788028",
  "788030",
  "788031",
  "788032",
  "788033",
  "788098",
  "788099",
  "788101",
  "788102",
  "788103",
  "788104",
  "788105",
  "788106",
  "788107",
  "788109",
  "788110",
  "788111",
  "788112",
  "788113",
  "788114",
  "788115",
  "788116",
  "788117",
  "788118",
  "788119",
  "788120",
  "788155",
  "788156",
  "788160",
  "788161",
  "788163",
  "788164",
  "788165",
  "788166",
  "788167",
  "788168",
  "788169",
  "788817",
  // Karimganj
  "788701",
  "788710",
  "788711",
  "788712",
  "788713",
  "788714",
  "788715",
  "788720",
  "788721",
  "788722",
  "788723",
  "788724",
  "788725",
  "788726",
  "788727",
  "788728",
  "788729",
  "788730",
  "788731",
  "788732",
  "788733",
  "788734",
  "788735",
  "788736",
  "788802",
  "788806",
  // Hailakandi
  "788150",
  "788151",
  "788152",
  "788153",
  "788154",
  "788162",
  // Goalpara
  "783101",
  "783120",
  "783121",
  "783122",
  "783123",
  "783124",
  "783125",
  "783126",
  "783127",
  "783128",
  "783129",
  "783130",
  "783131",
  // Bongaigaon
  "783380",
  "783381",
  "783382",
  "783383",
  "783384",
  "783385",
  "783386",
  "783387",
  "783388",
  "783389",
  "783390",
  "783391",
  "783392",
  "783393",
  "783394",
  // Chirang
  "783395",
  "783396",
  "783397",
  "783398",
  "783399",
  "783400",
  // Kokrajhar
  "783330",
  "783331",
  "783332",
  "783333",
  "783334",
  "783335",
  "783336",
  "783337",
  "783338",
  "783339",
  "783340",
  "783345",
  "783346",
  "783347",
  "783348",
  "783349",
  "783350",
  "783360",
  "783361",
  "783362",
  "783363",
  "783364",
  "783365",
  "783366",
  "783370",
  "783371",
  "783372",
  "783373",
  "783374",
  "783375",
  "783376",
  // Dhubri
  "783301",
  "783320",
  "783321",
  "783322",
  "783323",
  "783324",
  "783325",
  "783326",
  "783327",
  "783328",
  "783329",
  // South Salmara
  "783132",
  "783133",
  "783134",
  "783135",
  "783136",
  // Biswanath
  "784179",
  "784180",
  "784181",
  "784182",
  // Hojai
  "782437",
  "782438",
  "782439",
  "782440",
  "782442",
  "782443",
  "782444",
  // West Karbi Anglong
  "782451",
  "782452",
  "782453",
  "782454",
  "782455",
]);

// Assam districts list for dropdown
const ASSAM_DISTRICTS = [
  "Baksa",
  "Barpeta",
  "Biswanath",
  "Bongaigaon",
  "Cachar",
  "Charaideo",
  "Chirang",
  "Darrang",
  "Dhemaji",
  "Dhubri",
  "Dibrugarh",
  "Dima Hasao",
  "Goalpara",
  "Golaghat",
  "Hailakandi",
  "Hojai",
  "Jorhat",
  "Kamrup Metropolitan",
  "Kamrup Rural",
  "Karbi Anglong",
  "Karimganj",
  "Kokrajhar",
  "Lakhimpur",
  "Majuli",
  "Morigaon",
  "Nagaon",
  "Nalbari",
  "Sivasagar",
  "Sonitpur",
  "South Salmara-Mankachar",
  "Tamulpur",
  "Tinsukia",
  "Udalguri",
  "West Karbi Anglong",
];

type DeliveryOption = "Standard" | "Express";

// Delivery pricing rules
function getDeliveryPrices(pincode: string): {
  standard: number;
  express: number;
} {
  if (!pincode || pincode.length < 6) return { standard: 5900, express: 9900 };
  if (ASSAM_PINCODES.has(pincode)) return { standard: 5900, express: 9900 };
  if (PINCODE_RE.test(pincode)) return { standard: 9900, express: 14900 };
  return { standard: 5900, express: 9900 };
}

type FormState = {
  name: string;
  phone: string;
  houseNo: string;
  street: string;
  locality: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 3)
    errs.name = "Full name must be at least 3 characters";
  if (!PHONE_RE.test(form.phone.replace(/\s/g, "")))
    errs.phone = "Enter a valid 10-digit Indian mobile number";
  if (!form.houseNo.trim())
    errs.houseNo = "House/Flat/Apartment number is required";
  if (!form.street.trim()) errs.street = "Street/Road name is required";
  if (!form.locality.trim()) errs.locality = "Locality/Area is required";
  if (!form.city.trim()) errs.city = "City/Town is required";
  if (!form.district.trim()) errs.district = "District is required";
  if (!form.state.trim()) errs.state = "State is required";
  if (!PINCODE_RE.test(form.pincode))
    errs.pincode = "Enter a valid 6-digit pincode";
  return errs;
}

type PincodeStatus = "idle" | "checking" | "serviceable" | "not-serviceable";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    houseNo: "",
    street: "",
    locality: "",
    landmark: "",
    city: "",
    district: "",
    state: "Assam",
    pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [pincodeStatus, setPincodeStatus] = useState<PincodeStatus>("idle");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>("Standard");

  const deliveryPrices = getDeliveryPrices(form.pincode);
  const deliveryCost =
    deliveryOption === "Express"
      ? deliveryPrices.express
      : totalPrice >= 49900
        ? 0
        : deliveryPrices.standard;

  const grandTotal = totalPrice + deliveryCost;

  // Pincode serviceability check
  useEffect(() => {
    if (form.pincode.length === 6) {
      setPincodeStatus("checking");
      const timer = setTimeout(() => {
        setPincodeStatus(
          ASSAM_PINCODES.has(form.pincode) ? "serviceable" : "not-serviceable",
        );
      }, 500);
      return () => clearTimeout(timer);
    }
    setPincodeStatus("idle");
  }, [form.pincode]);

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleBlur(field: keyof FormState) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldErrors = validateForm(form);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true]),
    );
    setTouched(allTouched as Partial<Record<keyof FormState, boolean>>);
    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    if (pincodeStatus === "not-serviceable") return;
    if (!disclaimerAccepted) return;

    sessionStorage.setItem("checkout_address", JSON.stringify(form));
    sessionStorage.setItem("checkout_delivery_type", deliveryOption);
    sessionStorage.setItem("checkout_delivery_cost", String(deliveryCost));
    navigate({ to: "/payment" });
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center"
          data-ocid="checkout-empty"
        >
          <ShoppingBag size={48} className="text-muted-foreground/40 mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-2">
            Nothing to checkout
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Your cart is empty. Add some products first!
          </p>
          <Button
            onClick={() => navigate({ to: "/home" })}
            className="btn-primary border-0"
          >
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  // ─── Sign-in guard ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center"
          data-ocid="checkout-signin-required"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
            <Lock size={36} className="text-primary" />
          </div>
          <h2 className="font-display text-xl font-black text-foreground mb-2">
            Sign in Required
          </h2>
          <p className="text-sm text-muted-foreground mb-1 leading-relaxed max-w-xs">
            Please sign in to place your order — we'll send a confirmation to
            your registered email.
          </p>
          <p className="text-xs text-muted-foreground mb-6 max-w-xs">
            Your cart items are saved and will be waiting for you.
          </p>
          <Button
            onClick={() => navigate({ to: "/login" })}
            className="btn-primary border-0 flex items-center gap-2 h-11 px-6 text-sm"
            data-ocid="checkout-signin-button"
          >
            <LogIn size={18} />
            Sign In to Continue
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/home" })}
            className="mt-3 text-muted-foreground text-xs"
          >
            Continue Browsing
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="checkout-page">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={20} className="text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">
            Delivery Address
          </h1>
        </div>

        {/* Delivery note */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 mb-4 text-xs text-foreground flex items-start gap-2">
          <Truck size={14} className="text-secondary flex-none mt-0.5" />
          <span>
            <span className="font-semibold text-secondary">
              Assam delivery only.
            </span>{" "}
            We currently deliver within Assam. Enter your complete Assam address
            below.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Address form card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="checkout-name" className="text-sm font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-name"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                placeholder="Dipankar Bora"
                className="h-11"
                data-ocid="checkout-name"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="checkout-phone" className="text-sm font-semibold">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <span className="h-11 flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground font-mono font-semibold flex-none">
                  +91
                </span>
                <Input
                  id="checkout-phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  placeholder="98765 43210"
                  className="h-11"
                  maxLength={14}
                  data-ocid="checkout-phone"
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> {errors.phone}
                </p>
              )}
            </div>

            {/* House/Flat No */}
            <div className="space-y-1.5">
              <Label
                htmlFor="checkout-houseno"
                className="text-sm font-semibold"
              >
                House / Flat / Apartment No.{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-houseno"
                type="text"
                value={form.houseNo}
                onChange={handleChange("houseNo")}
                onBlur={handleBlur("houseNo")}
                placeholder="e.g. Flat 4B, House No. 12"
                className="h-11"
                data-ocid="checkout-houseno"
              />
              {touched.houseNo && errors.houseNo && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> {errors.houseNo}
                </p>
              )}
            </div>

            {/* Street/Road Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="checkout-street"
                className="text-sm font-semibold"
              >
                Street / Road Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-street"
                type="text"
                value={form.street}
                onChange={handleChange("street")}
                onBlur={handleBlur("street")}
                placeholder="e.g. GS Road, MG Road"
                className="h-11"
                data-ocid="checkout-street"
              />
              {touched.street && errors.street && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> {errors.street}
                </p>
              )}
            </div>

            {/* Locality/Area/Colony */}
            <div className="space-y-1.5">
              <Label
                htmlFor="checkout-locality"
                className="text-sm font-semibold"
              >
                Locality / Area / Colony{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-locality"
                type="text"
                value={form.locality}
                onChange={handleChange("locality")}
                onBlur={handleBlur("locality")}
                placeholder="e.g. Paltan Bazaar, Chandmari"
                className="h-11"
                data-ocid="checkout-locality"
              />
              {touched.locality && errors.locality && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> {errors.locality}
                </p>
              )}
            </div>

            {/* Landmark (optional) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="checkout-landmark"
                className="text-sm font-semibold text-muted-foreground"
              >
                Landmark <span className="text-xs font-normal">(optional)</span>
              </Label>
              <Input
                id="checkout-landmark"
                type="text"
                value={form.landmark}
                onChange={handleChange("landmark")}
                placeholder="e.g. Near Big Bazaar, Opposite BSNL Office"
                className="h-11"
                data-ocid="checkout-landmark"
              />
            </div>

            {/* City + District grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="checkout-city"
                  className="text-sm font-semibold"
                >
                  City / Town <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="checkout-city"
                  type="text"
                  value={form.city}
                  onChange={handleChange("city")}
                  onBlur={handleBlur("city")}
                  placeholder="Guwahati"
                  className="h-11"
                  data-ocid="checkout-city"
                />
                {touched.city && errors.city && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle size={11} /> {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="checkout-district"
                  className="text-sm font-semibold"
                >
                  District <span className="text-destructive">*</span>
                </Label>
                <select
                  id="checkout-district"
                  value={form.district}
                  onChange={handleChange("district")}
                  onBlur={handleBlur("district")}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                  data-ocid="checkout-district"
                >
                  <option value="">Select district</option>
                  {ASSAM_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {touched.district && errors.district && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle size={11} /> {errors.district}
                  </p>
                )}
              </div>
            </div>

            {/* State (read-only) + Pincode */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="checkout-state"
                  className="text-sm font-semibold"
                >
                  State
                </Label>
                <Input
                  id="checkout-state"
                  type="text"
                  value="Assam"
                  readOnly
                  className="h-11 bg-muted text-muted-foreground cursor-not-allowed"
                  data-ocid="checkout-state"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="checkout-pincode"
                  className="text-sm font-semibold"
                >
                  Pincode <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="checkout-pincode"
                    type="text"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={handleChange("pincode")}
                    onBlur={handleBlur("pincode")}
                    placeholder="781001"
                    maxLength={6}
                    className={`h-11 pr-10 ${
                      pincodeStatus === "serviceable"
                        ? "border-secondary focus:border-secondary"
                        : pincodeStatus === "not-serviceable"
                          ? "border-destructive focus:border-destructive"
                          : ""
                    }`}
                    data-ocid="checkout-pincode"
                  />
                  {pincodeStatus === "checking" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {pincodeStatus === "serviceable" && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
                    />
                  )}
                  {pincodeStatus === "not-serviceable" && (
                    <XCircle
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
                    />
                  )}
                </div>
                {pincodeStatus === "serviceable" && (
                  <p className="text-xs text-secondary flex items-center gap-1 font-medium">
                    <CheckCircle2 size={11} /> Delivery available!
                  </p>
                )}
                {pincodeStatus === "not-serviceable" && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle size={11} /> Not serviceable — Assam pincodes only.
                  </p>
                )}
                {touched.pincode &&
                  errors.pincode &&
                  pincodeStatus === "idle" && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <XCircle size={11} /> {errors.pincode}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Delivery Type Selection */}
          <div className="space-y-3" data-ocid="checkout-delivery-type-section">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Choose Delivery Speed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Standard Delivery */}
              <button
                type="button"
                onClick={() => setDeliveryOption("Standard")}
                className={`flex flex-col gap-1.5 p-3.5 rounded-xl border-2 text-left transition-all ${
                  deliveryOption === "Standard"
                    ? "border-secondary bg-secondary/5"
                    : "border-border bg-card hover:border-secondary/40"
                }`}
                data-ocid="checkout-delivery-standard"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-1.5 rounded-lg ${deliveryOption === "Standard" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}
                  >
                    <Truck size={16} />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-none transition-all ${
                      deliveryOption === "Standard"
                        ? "border-secondary bg-secondary"
                        : "border-border"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-bold mt-0.5 ${deliveryOption === "Standard" ? "text-foreground" : "text-muted-foreground"}`}
                >
                  Standard
                </p>
                <p
                  className={`text-[11px] font-semibold ${deliveryOption === "Standard" ? "text-secondary" : "text-muted-foreground"}`}
                >
                  {totalPrice >= 49900
                    ? "FREE"
                    : formatPrice(BigInt(deliveryPrices.standard))}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  5–7 business days
                </p>
                {totalPrice >= 49900 && (
                  <p className="text-[10px] text-secondary font-medium">
                    Free on ₹499+ orders
                  </p>
                )}
              </button>

              {/* Express Delivery */}
              <button
                type="button"
                onClick={() => setDeliveryOption("Express")}
                className={`flex flex-col gap-1.5 p-3.5 rounded-xl border-2 text-left transition-all ${
                  deliveryOption === "Express"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
                data-ocid="checkout-delivery-express"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-1.5 rounded-lg ${deliveryOption === "Express" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <Zap size={16} />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-none transition-all ${
                      deliveryOption === "Express"
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-bold mt-0.5 ${deliveryOption === "Express" ? "text-foreground" : "text-muted-foreground"}`}
                >
                  Express
                </p>
                <p
                  className={`text-[11px] font-semibold ${deliveryOption === "Express" ? "text-primary" : "text-muted-foreground"}`}
                >
                  {formatPrice(BigInt(deliveryPrices.express))}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  1–3 business days
                </p>
                <p className="text-[10px] text-primary font-medium">
                  Always charged
                </p>
              </button>
            </div>

            {/* Selected delivery summary */}
            <div className="bg-muted/40 border border-border rounded-lg px-3.5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                {deliveryOption === "Express" ? (
                  <Zap size={13} className="text-primary flex-none" />
                ) : (
                  <Truck size={13} className="text-secondary flex-none" />
                )}
                <span className="text-muted-foreground">
                  {deliveryOption === "Express"
                    ? "Express Delivery"
                    : "Standard Delivery"}
                </span>
              </div>
              <span
                className={`text-xs font-bold ${deliveryOption === "Express" ? "text-primary" : "text-secondary"}`}
              >
                {deliveryCost === 0
                  ? "FREE"
                  : formatPrice(BigInt(deliveryCost))}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div
            className="bg-muted/40 border border-border rounded-xl p-4"
            data-ocid="checkout-order-summary"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={15} className="text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                Order Summary ({totalItems}{" "}
                {totalItems === 1 ? "item" : "items"})
              </p>
            </div>

            <div className="space-y-1.5 mb-3">
              {items.map(({ product, quantity }) => {
                const priceBig = BigInt(product.price);
                const discountBig = BigInt(product.discountPercent);
                const qty = Number(quantity);
                const finalPrice = discountedPrice(priceBig, discountBig);
                return (
                  <div
                    key={product.id.toString()}
                    className="flex items-center gap-2 text-xs"
                  >
                    <img
                      src={
                        product.imageUrls[0] ?? "/assets/images/placeholder.svg"
                      }
                      alt={product.title}
                      className="w-8 h-8 object-cover rounded flex-none bg-muted"
                    />
                    <span className="text-muted-foreground flex-1 line-clamp-1 min-w-0">
                      {product.title} × {qty}
                    </span>
                    <span className="font-medium text-foreground flex-none">
                      {formatPrice(finalPrice * BigInt(qty))}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator className="mb-3" />

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(BigInt(Math.round(totalPrice)))}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {deliveryOption === "Express" ? (
                    <Zap size={11} className="text-primary" />
                  ) : (
                    <Truck size={11} />
                  )}
                  {deliveryOption === "Express"
                    ? "Express Delivery"
                    : "Standard Delivery"}
                </span>
                {deliveryCost === 0 ? (
                  <span className="text-secondary font-semibold">FREE</span>
                ) : (
                  <span>{formatPrice(BigInt(deliveryCost))}</span>
                )}
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between text-sm font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">
                {formatPrice(BigInt(Math.round(grandTotal)))}
              </span>
            </div>
          </div>

          {/* Delivery confirmation disclaimer */}
          <section
            className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3"
            data-ocid="checkout-disclaimer-banner"
            aria-label="Delivery confirmation"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={18}
                className="text-amber-600 flex-none mt-0.5"
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-amber-900">
                Delivery Notice
              </p>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              AssamRoots delivers only within Assam. Please ensure your delivery
              address is an Assam address. Orders with incorrect or non-Assam
              addresses will be cancelled and refunded.
            </p>
            <div className="flex items-start gap-2.5 pt-1">
              <Checkbox
                id="disclaimer-accept"
                checked={disclaimerAccepted}
                onCheckedChange={(checked) =>
                  setDisclaimerAccepted(checked === true)
                }
                className="mt-0.5 border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                data-ocid="checkout-disclaimer-checkbox"
              />
              <Label
                htmlFor="disclaimer-accept"
                className="text-xs text-amber-900 font-medium leading-relaxed cursor-pointer"
              >
                I confirm my delivery address is within Assam and I accept the
                above terms
              </Label>
            </div>
          </section>

          <Button
            type="submit"
            className="w-full btn-primary border-0 h-12 text-base font-bold flex items-center justify-center gap-2"
            disabled={
              pincodeStatus === "not-serviceable" ||
              pincodeStatus === "checking" ||
              !disclaimerAccepted
            }
            data-ocid="checkout-submit"
          >
            Continue to Payment
            <ArrowRight size={18} />
          </Button>

          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            🔒 Your information is secure and encrypted
          </p>
        </form>
      </div>
    </Layout>
  );
}
