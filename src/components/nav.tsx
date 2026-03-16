import React from "react";
import Link from "next/link";

export default function Nav() {
    return (


        <nav className="bg-green-900 relative w-full z-20 top-0 inset-s-0 border-b border-default">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-white-800 text-xl text-heading font-semibold whitespace-nowrap print:hidden">Ideal Home</span>
                </a>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                        <li>
                            <a href="/builder" className="block py-2 px-3 text-white-950 bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Make Question</a>
                        </li>
                        <li>
                            <a href="/drafts" className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Drafts</a>
                        </li>
                        <li>
                            <a href="/contact" className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}