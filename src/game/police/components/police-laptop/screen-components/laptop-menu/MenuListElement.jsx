import { createElement } from "react";

// ##### Laptop Menu Item
// -----> Einheitlicher, semantischer Button für Navigation und Laptop-Aktionen.
export function MenuListElement({
    active = false,
    icon,
    title,
    onClick
}) {
    return (
        <button
            type="button"
            className={`flex h-11 w-full items-center justify-center gap-3 rounded-md px-3 text-sm transition-colors md:justify-start ${
                active
                    ? "bg-blue-700 text-white"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
            aria-label={title}
            title={title}
            onClick={onClick}
        >
            {createElement(icon, {
                className: "shrink-0 text-base",
                "aria-hidden": true
            })}
            <span className="hidden truncate md:block">{title}</span>
        </button>
    );
}
