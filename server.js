```js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");
const { ethers } = require("ethers");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json({
  limit: "1mb"
}));


// ===============================
// RATE LIMITER
// ===============================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: "Too many requests. Try again later."
  }
});

app.use(limiter);


// ===============================
// SUPABASE
// ===============================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


// ===============================
// ETHERS CONFIG
// ===============================

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);


// ===============================
// HELPERS
// ===============================

function validateWallet(walletAddress) {
  return /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Syntrix backend running"
  });
});


// ===============================
// MAIN AIRDROP ENDPOINT
// ===============================

app.post("/api/claim-airdrop", async (req, res) => {

  try {

    const {
      email,
      walletAddress,
      captchaToken,
      monthlySpend,
      cityTier,
      ageGroup,
      userPersona,
      luxuryAllocation,
      purchaseBlocker,
      shippingCostTolerance,
      paymentPreference,
      returnPolicyImportance,
      discoveryChannel,
      trustAnchor,
      brandRiskTolerance,
      shoppingDevice,
      conversionTrigger,
      decisionTimeline,
      giftingBehavior,
      priceComparisonBehavior,
      peakShoppingTime,
      painPoint,
      bestPoint,
      complementPoint,
      referralVoice,
      shoppingCategories,
      categorySpendCeiling,
      postPurchaseAction,
      returnHistoryReason
    } = req.body;


    // ===========================
    // BASIC VALIDATION
    // ===========================

    if (!email || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: "Email and wallet required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address"
      });
    }

    if (!validateWallet(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid wallet address"
      });
    }

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        error: "Captcha verification required"
      });
    }

    if (
      !shoppingCategories ||
      !Array.isArray(shoppingCategories) ||
      shoppingCategories.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Select at least one shopping category"
      });
    }


    // ===========================
    // DUPLICATE WALLET CHECK
    // ===========================

    const { data: existingWallet } = await supabase
      .from("airdrop_claims")
      .select("id")
      .eq("wallet_address", walletAddress)
      .maybeSingle();

    if (existingWallet) {
      return res.status(409).json({
        success: false,
        error: "Wallet already claimed"
      });
    }


    // ===========================
    // SAVE USER DATA
    // ===========================

    const { data: insertedUser, error: insertError } =
      await supabase
        .from("airdrop_claims")
        .insert([
          {
            email,

            wallet_address: walletAddress,

            monthly_spend: monthlySpend,
            city_tier: cityTier,
            age_group: ageGroup,
            user_persona: userPersona,
            luxury_allocation: luxuryAllocation,

            purchase_blocker: purchaseBlocker,
            shipping_cost_tolerance: shippingCostTolerance,
            payment_preference: paymentPreference,
            return_policy_importance: returnPolicyImportance,

            discovery_channel: discoveryChannel,
            trust_anchor: trustAnchor,
            brand_risk_tolerance: brandRiskTolerance,
            shopping_device: shoppingDevice,

            conversion_trigger: conversionTrigger,
            decision_timeline: decisionTimeline,
            gifting_behavior: giftingBehavior,
            price_comparison_behavior: priceComparisonBehavior,
            peak_shopping_time: peakShoppingTime,

            pain_point: painPoint,
            best_point: bestPoint,
            complement_point: complementPoint,
            referral_voice: referralVoice,

            shopping_categories: shoppingCategories,

            category_spend_ceiling: categorySpendCeiling,
            post_purchase_action: postPurchaseAction,
            return_history_reason: returnHistoryReason,

            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

    if (insertError) {
      console.error(insertError);

      return res.status(500).json({
        success: false,
        error: "Database insertion failed"
      });
    }


    // ===========================
    // MOCK AIRDROP TX
    // ===========================

    // Replace later with actual ERC20 transfer

    const fakeTxHash =
      ethers.hexlify(
        ethers.randomBytes(32)
      );


    // ===========================
    // SUCCESS RESPONSE
    // ===========================

    return res.json({
      success: true,
      message: "Survey submitted successfully",
      transactionHash: fakeTxHash,
      userId: insertedUser.id
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });

  }

});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
