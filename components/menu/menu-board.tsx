import { getMenuBoard } from "@/lib/menu-data";
import { MenuRow } from "@/components/menu/menu-row";

export async function MenuBoard() {
  const menu = await getMenuBoard();

  if (menu.length === 0) {
    return (
      <p className="font-body text-kopi-ink-soft">
        Menu belum bisa ditampilkan saat ini — silakan kembali lagi sebentar
        lagi.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
      {menu.map((category) => (
        <section
          key={category.key}
          aria-labelledby={`cat-${category.key}`}
          className="flex flex-col"
        >
          <h2
            id={`cat-${category.key}`}
            className="mb-6 border-b-2 border-kopi-ink pb-2 font-display text-3xl tracking-tight text-kopi-heritage md:text-4xl"
          >
            {category.label}
          </h2>

          <ul className="flex-1 divide-y divide-kopi-line border-b border-kopi-line">
            {category.items.map((item) => (
              <MenuRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
