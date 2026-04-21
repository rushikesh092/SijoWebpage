import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const WHATSAPP_ORDER_NUMBER = "918879848479";

const CartPage = () => {
  const { cartItems, changeQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const createWhatsAppCheckoutLink = () => {
    const orderLines = cartItems.map(
      (item, index) => `${index + 1}. ${item.name} x ${item.quantity} - ${item.price}`
    );

    const message = [
      "Hello Luxe Bath & Kitchen Team,",
      "",
      "I would like to place an order for the following items:",
      ...orderLines,
      "",
      `Total items: ${totalItems}`,
      `Subtotal: ${formatCurrency(subtotal)}`,
      "",
      "Please confirm product availability and next steps.",
      "Note: I understand delivery/online checkout is currently unavailable."
    ].join("\n");

    return `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="bg-[#06080B] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-white">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="mt-10 rounded-sm border border-slateGreySoft bg-slateGrey p-8 text-center">
            <p className="text-lg text-textSoft">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-sm bg-brushedGold px-6 py-3 text-sm font-semibold text-obsidian transition hover:bg-brushedGoldSoft"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-sm border border-slateGreySoft bg-slateGrey p-4 sm:grid-cols-[120px_1fr_auto]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-full rounded-sm object-cover sm:w-[120px]"
                  />
                  <div>
                    <h3 className="text-xl font-medium text-white">{item.name}</h3>
                    <p className="mt-2 text-lg font-semibold text-brushedGold">{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-3">
                    <div className="inline-flex items-center rounded-sm border border-white/20">
                      <button
                        className="p-2 text-white/80 transition hover:text-brushedGold"
                        onClick={() => changeQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-10 text-center text-sm font-medium text-white">
                        {item.quantity}
                      </span>
                      <button
                        className="p-2 text-white/80 transition hover:text-brushedGold"
                        onClick={() => changeQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-red-400"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-sm border border-slateGreySoft bg-slateGrey p-6">
              <h2 className="text-2xl font-semibold text-white">Order Summary</h2>
              <div className="mt-6 flex items-center justify-between text-base text-textSoft">
                <span>Subtotal</span>
                <span className="text-xl font-semibold text-brushedGold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-textSoft">
                Delivery and online checkout are currently unavailable. Continue on WhatsApp to
                confirm your order with our team.
              </p>
              <a
                href={createWhatsAppCheckoutLink()}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-brushedGold px-4 py-3 text-sm font-semibold text-obsidian transition hover:bg-brushedGoldSoft"
              >
                Proceed on WhatsApp
              </a>
              <button
                className="mt-3 w-full rounded-sm border border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:border-red-400 hover:text-red-300"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
