import HttpClient "mo:caffeineai-http-outcalls/outcall";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Array "mo:core/Array";
import Char "mo:core/Char";

mixin () {

  // Razorpay credentials (backend-only, NEVER sent to frontend)
  let RAZORPAY_KEY_ID : Text = "rzp_test_Six6S0hYJkJGqC";
  let RAZORPAY_KEY_SECRET : Text = "4kXi13u8IDq5O4ukQ9ohBndV";

  // Base64 encoding table
  let B64_TABLE : [Nat8] = [
    65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
    81,82,83,84,85,86,87,88,89,90,
    97,98,99,100,101,102,103,104,105,106,107,108,109,
    110,111,112,113,114,115,116,117,118,119,120,121,122,
    48,49,50,51,52,53,54,55,56,57,
    43,47,
  ];

  let SHA256_K : [Nat32] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  func nat8ToChar(n : Nat8) : Char {
    Char.fromNat32(Nat32.fromNat(n.toNat()));
  };

  func base64Encode(input : Blob) : Text {
    let bytes = input.toArray();
    let n = bytes.size();
    var result = "";
    var i = 0;
    while (i < n) {
      let b0 = bytes[i].toNat();
      let b1 = if (i + 1 < n) bytes[i + 1].toNat() else 0;
      let b2 = if (i + 2 < n) bytes[i + 2].toNat() else 0;
      let idx0 = (b0 / 4) % 64;
      let idx1 = ((b0 % 4) * 16 + b1 / 16) % 64;
      let idx2 = ((b1 % 16) * 4 + b2 / 64) % 64;
      let idx3 = b2 % 64;
      result #= nat8ToChar(B64_TABLE[idx0]).toText();
      result #= nat8ToChar(B64_TABLE[idx1]).toText();
      result #= if (i + 1 < n) nat8ToChar(B64_TABLE[idx2]).toText() else "=";
      result #= if (i + 2 < n) nat8ToChar(B64_TABLE[idx3]).toText() else "=";
      i += 3;
    };
    result;
  };

  func basicAuthHeader() : Text {
    // Pre-computed Base64 of "rzp_test_Six6S0hYJkJGqC:4kXi13u8IDq5O4ukQ9ohBndV"
    "Basic cnpwX3Rlc3RfU2l4NlMwaFlKa0pHcUM6NGtYaTEzdThJRHE1TzR1a1E5b2hCbmRW";
  };

  func rotr32(x : Nat32, n : Nat32) : Nat32 {
    (x >> n) | (x << (32 - n));
  };

  func sha256Block(state : [var Nat32], block : [Nat8], offset : Nat) {
    let w : [var Nat32] = [var
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    ];
    var i = 0;
    while (i < 16) {
      let j = offset + i * 4;
      w[i] := (Nat32.fromNat(block[j].toNat()) << 24)
             | (Nat32.fromNat(block[j + 1].toNat()) << 16)
             | (Nat32.fromNat(block[j + 2].toNat()) << 8)
             | Nat32.fromNat(block[j + 3].toNat());
      i += 1;
    };
    i := 16;
    while (i < 64) {
      let s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ (w[i - 15] >> 3);
      let s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ (w[i - 2] >> 10);
      w[i] := w[i - 16] +% s0 +% w[i - 7] +% s1;
      i += 1;
    };
    var a = state[0];
    var b = state[1];
    var c = state[2];
    var d = state[3];
    var e = state[4];
    var f = state[5];
    var g = state[6];
    var h = state[7];
    i := 0;
    while (i < 64) {
      let S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      let ch = (e & f) ^ (Nat32.bitnot(e) & g);
      let temp1 = h +% S1 +% ch +% SHA256_K[i] +% w[i];
      let S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      let maj = (a & b) ^ (a & c) ^ (b & c);
      let temp2 = S0 +% maj;
      h := g;
      g := f;
      f := e;
      e := d +% temp1;
      d := c;
      c := b;
      b := a;
      a := temp1 +% temp2;
      i += 1;
    };
    state[0] := state[0] +% a;
    state[1] := state[1] +% b;
    state[2] := state[2] +% c;
    state[3] := state[3] +% d;
    state[4] := state[4] +% e;
    state[5] := state[5] +% f;
    state[6] := state[6] +% g;
    state[7] := state[7] +% h;
  };

  func sha256(data : [Nat8]) : [Nat8] {
    let state : [var Nat32] = [var
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];
    let msgLen = data.size();
    let bitLen : Nat = msgLen * 8;
    let paddedLen = ((msgLen + 9 + 63) / 64) * 64;
    let lenBytes : [Nat8] = Array.tabulate<Nat8>(8, func(i) {
      let rightShift = (7 - i) * 8;
      Nat8.fromNat((bitLen / Nat.pow(2, rightShift)) % 256);
    });
    let padded = Array.tabulate<Nat8>(paddedLen, func(idx) {
      if (idx < msgLen) data[idx]
      else if (idx == msgLen) 0x80
      else if (idx >= paddedLen - 8) lenBytes[idx - (paddedLen - 8)]
      else 0x00;
    });
    var blockOffset = 0;
    while (blockOffset < padded.size()) {
      sha256Block(state, padded, blockOffset);
      blockOffset += 64;
    };
    Array.tabulate<Nat8>(32, func(idx) {
      let word = state[idx / 4];
      let shift = Nat32.fromNat((3 - (idx % 4)) * 8);
      Nat8.fromNat(((word >> shift) & 0xFF).toNat());
    });
  };

  func hmacSha256(key : [Nat8], message : [Nat8]) : [Nat8] {
    let blockSize = 64;
    let normalizedKey : [Nat8] = if (key.size() > blockSize) {
      let hashed = sha256(key);
      Array.tabulate<Nat8>(blockSize, func(i) {
        if (i < hashed.size()) hashed[i] else 0x00;
      });
    } else {
      Array.tabulate<Nat8>(blockSize, func(i) {
        if (i < key.size()) key[i] else 0x00;
      });
    };
    let iPad = normalizedKey.map(func(b : Nat8) : Nat8 { b ^ 0x36 });
    let oPad = normalizedKey.map(func(b : Nat8) : Nat8 { b ^ 0x5c });
    let innerHash = sha256(iPad.concat(message));
    sha256(oPad.concat(innerHash));
  };

  func hexEncode(bytes : [Nat8]) : Text {
    let hexChars : [Text] = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    for (b in bytes.values()) {
      let n = b.toNat();
      result #= hexChars[n / 16] # hexChars[n % 16];
    };
    result;
  };

  // Extracts the string or integer value for a given key in a flat JSON object.
  func extractJsonField(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\"";
    if (not json.contains(#text needle)) return null;
    var parts = json.split(#text needle);
    switch (parts.next()) { case null return null; case _ {} };
    let afterKey = switch (parts.next()) { case null return null; case (?s) s };
    var state = 0; // 0=before colon, 1=after colon, 2=in string, 3=in number, 4=done
    var value = "";
    for (ch in afterKey.toIter()) {
      switch (state) {
        case 0 { if (ch == ':') state := 1 };
        case 1 {
          if (ch == '\u{22}') { state := 2 }
          else if (ch.isDigit() or ch == '-') {
            value #= ch.toText();
            state := 3;
          };
        };
        case 2 {
          if (ch == '\u{22}') state := 4
          else value #= ch.toText();
        };
        case 3 {
          if (ch.isDigit()) value #= ch.toText()
          else state := 4;
        };
        case _ {};
      };
    };
    if (value == "" or value == "-") null else ?value;
  };

  /// Transform function required by the http-outcalls extension.
  public query func razorpayTransform(
    input : HttpClient.TransformationInput,
  ) : async HttpClient.TransformationOutput {
    HttpClient.transform(input);
  };

  /// Create a Razorpay order via the Razorpay Orders API.
  /// Returns { orderId, amount, currency } on success or an error message.
  public shared func createRazorpayOrder(
    amount : Nat,
    receipt : Text,
  ) : async { #ok : { orderId : Text; amount : Nat; currency : Text }; #err : Text } {
    if (amount < 100) {
      return #err("Amount must be at least 100 paise");
    };
    let body = "{\"amount\":" # amount.toText()
      # ",\"currency\":\"INR\""
      # ",\"receipt\":\"" # receipt # "\"}";
    let headers : [HttpClient.Header] = [
      { name = "Authorization"; value = basicAuthHeader() },
      { name = "Content-Type"; value = "application/json" },
    ];
    try {
      let responseText = await HttpClient.httpPostRequest(
        "https://api.razorpay.com/v1/orders",
        headers,
        body,
        razorpayTransform,
      );
      switch (
        extractJsonField(responseText, "id"),
        extractJsonField(responseText, "amount"),
        extractJsonField(responseText, "currency"),
      ) {
        case (?orderId, ?amountStr, ?currency) {
          switch (amountStr.toNat()) {
            case (?parsedAmount) #ok({ orderId; amount = parsedAmount; currency });
            case null #err("Failed to parse amount in Razorpay response");
          };
        };
        case _ {
          switch (extractJsonField(responseText, "description")) {
            case (?errMsg) #err("Razorpay API error: " # errMsg);
            case null #err("Unexpected Razorpay response: " # responseText);
          };
        };
      };
    } catch (e) {
      #err("HTTP request failed: " # e.message());
    };
  };

  /// Verify a Razorpay payment signature.
  /// Computes HMAC-SHA256(orderId + "|" + paymentId, KEY_SECRET) and compares
  /// the hex digest to razorpaySignature.
  public shared func verifyRazorpayPayment(
    razorpayOrderId : Text,
    razorpayPaymentId : Text,
    razorpaySignature : Text,
  ) : async { #ok : Bool; #err : Text } {
    if (razorpayOrderId == "" or razorpayPaymentId == "" or razorpaySignature == "") {
      return #err("Missing required fields");
    };
    let message = razorpayOrderId # "|" # razorpayPaymentId;
    let keyBytes = RAZORPAY_KEY_SECRET.encodeUtf8().toArray();
    let msgBytes = message.encodeUtf8().toArray();
    let digest = hmacSha256(keyBytes, msgBytes);
    let computedHex = hexEncode(digest);
    #ok(computedHex == razorpaySignature);
  };

};
