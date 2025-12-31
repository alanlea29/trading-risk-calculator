export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { productId, licenseKey } = req.body || {};

  if (!productId || !licenseKey) {
    return res.status(400).json({
      success: false,
      message: "Missing productId or licenseKey",
    });
  }

  try {
    const params = new URLSearchParams();
    params.append("product_id", productId);
    params.append("license_key", licenseKey);

    const response = await fetch(
      "https://api.gumroad.com/v2/licenses/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(401).json({
        success: false,
        message: "Invalid license key",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error verifying license",
    });
  }
}
