"use client";
/* eslint-disable react/prop-types */

export default function LargeButton({idToHref, nameButton}) {
    return (
        <>
            <a
                href={idToHref}
                className="mt-6 bg-[#FF8C00] hover:bg-orange-600 hover:scale-102 transition-all duration-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full"
            >
                {nameButton}
            </a>
        </>
    )
}