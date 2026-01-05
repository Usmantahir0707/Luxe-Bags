import { useEffect, useState } from "react";
import PhoneInput from "./PhoneInput";
import { useShopContext } from "../context/ShopContext";

export default function CheckoutPage({ onBack, setCurrentView }) {
  const { cartItems, orderForm, setOrderForm } = useShopContext();
  const [formError, setFormError] = useState({});

  const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

  useEffect(() => {
    const productArr = cartItems.map((x) => ({
      productId: x.id,
      quantity: x.quantity,
      color: x.color,
      size: x.size ? x.size : "M",
    }));

    setOrderForm((p) => ({
      ...p,
      products: productArr,
      totalPrice: total,
    }));
  }, []);

  // ------------------------------
  // VALIDATION LOGIC
  // ------------------------------
  const validateForm = () => {
    const errors = {};

    if (!orderForm.customerName.trim())
      errors.customerName = "Name is required";

    if (!orderForm.customerEmail.trim())
      errors.customerEmail = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(orderForm.customerEmail))
      errors.customerEmail = "Invalid email format";

    if (!orderForm.customerPhone.trim() || orderForm.customerPhone.length < 13)
      errors.customerPhone = "Phone number is invalid";

    if (!orderForm.shippingAddress.address.trim())
      errors.address = "Address is required";

    if (!orderForm.shippingAddress.city.trim())
      errors.city = "City is required";

    if (!orderForm.shippingAddress.postalCode.trim())
      errors.postalCode = "Postal code is required";

    setFormError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleProceed = () => {
    if (!validateForm()) return; // prevent proceed
    setCurrentView("payment");
  };

  const borderClass = (err) =>
    `p-3 bg-zinc-950 border rounded w-full ${err ? "border-red-500" : "border-zinc-800"}`;

  return (
    <div className="min-h-screen bg-(--base-1) text-(--text)">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onBack} className="text-(--main-1) mb-4">
          ← Back to shop
        </button>
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-(--base-2) p-6 rounded-xl border border-(--base-3)">
            <h2 className="text-lg mb-4">Billing details</h2>

            <form autoComplete="off" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <input
                    value={orderForm.customerName}
                    onChange={(e) => {
                      setOrderForm((p) => ({ ...p, customerName: e.target.value }));
                      setFormError((err) => ({ ...err, customerName: "" }));
                    }}
                    className={borderClass(formError.customerName)}
                    placeholder="Full name"
                  />
                  {formError.customerName && (
                    <p className="text-(--main-1) text-xs mt-1">{formError.customerName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    value={orderForm.customerEmail}
                    onChange={(e) => {
                      setOrderForm((p) => ({ ...p, customerEmail: e.target.value }));
                      setFormError((err) => ({ ...err, customerEmail: "" }));
                    }}
                    className={borderClass(formError.customerEmail)}
                    placeholder="Email"
                  />
                  {formError.customerEmail && (
                    <p className="text-(--main-1) text-xs mt-1">{formError.customerEmail}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-2">
                  <PhoneInput
                    value={orderForm.customerPhone}
                    setValue={(val) => {
                      setOrderForm((p) => ({ ...p, customerPhone: val }));
                      setFormError((err) => ({ ...err, customerPhone: "" }));
                    }}
                    inputStyle={"bg-zinc-950"}
                    border={formError.customerPhone ? "border border-red-500" : "border border-zinc-800"}
                  />
                  {formError.customerPhone && (
                    <p className="text-(--main-1) text-xs mt-1">{formError.customerPhone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <input
                  value={orderForm.shippingAddress.address}
                  onChange={(e) => {
                    setOrderForm((p) => ({
                      ...p,
                      shippingAddress: { ...p.shippingAddress, address: e.target.value },
                    }));
                    setFormError((err) => ({ ...err, address: "" }));
                  }}
                  className={borderClass(formError.address)}
                  placeholder="Address"
                />
                {formError.address && (
                  <p className="text-(--main-1) text-xs mt-1">{formError.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* City */}
                <div>
                  <input
                    value={orderForm.shippingAddress.city}
                    onChange={(e) => {
                      setOrderForm((p) => ({
                        ...p,
                        shippingAddress: { ...p.shippingAddress, city: e.target.value },
                      }));
                      setFormError((err) => ({ ...err, city: "" }));
                    }}
                    className={borderClass(formError.city)}
                    placeholder="City"
                  />
                  {formError.city && (
                    <p className="text-(--main-1) text-xs mt-1">{formError.city}</p>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <input
                    value={orderForm.shippingAddress.postalCode}
                    onChange={(e) => {
                      setOrderForm((p) => ({
                        ...p,
                        shippingAddress: { ...p.shippingAddress, postalCode: e.target.value },
                      }));
                      setFormError((err) => ({ ...err, postalCode: "" }));
                    }}
                    className={borderClass(formError.postalCode)}
                    placeholder="Postal code"
                  />
                  {formError.postalCode && (
                    <p className="text-(--main-1) text-xs mt-1">{formError.postalCode}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          <aside className="bg-(--base-2) p-6 rounded-xl border border-(--base-3)">
            <h3 className="text-lg mb-4">Your order</h3>

            <ul className="space-y-3 mb-4">
              {cartItems.map((it) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">{it.name}</div>
                    <div className="text-xs text-zinc-400">
                      {it.quantity} × Rs.{it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm">Rs.{(it.price * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between text-zinc-400 mb-4">
              <span>Subtotal</span>
              <strong className="text-(--text)">Rs.{total.toFixed(2)}</strong>
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3 rounded-full bg-linear-to-r from-(--main-1) to-(--main-2) text-(--text)"
            >
              Proceed to payment
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
