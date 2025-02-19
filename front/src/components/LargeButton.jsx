"use client";
/* eslint-disable react/prop-types */

export default function LargeButton({idToHref, nameButton}) {
    return (
        <>
            <a
                href={idToHref}
                className="w-full sm:w-auto bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] text-white px-4 py-2 rounded-lg text-sm sm:text-lg font-semibold"
            >
                {nameButton}
            </a>
        </>
    )
}