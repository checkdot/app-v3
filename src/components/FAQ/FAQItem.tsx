"use client"

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { Fragment } from "react"
import { AnimatePresence, easeOut, motion } from "framer-motion"

interface FAQItemProps {
  q: string
  a: string
  className?: string
}

const FAQItem: React.FC<FAQItemProps> = ({ q, a, className }) => {
  return (
    <Disclosure as="div" className={`w-full ${className}`}>
      {({ open }) => (
        <>
          <DisclosureButton className="w-full bg-white dark:bg-[#080811] py-3 px-5 text-lg rounded-xl text-left flex items-center justify-between">
            <span>{q}</span>
            <span className="shrink-0 ml-5 text-[#33f693] cursor-pointer relative w-5 h-5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.svg
                    key="minus"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="size-5 absolute"
                    fill="currentColor"
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                  >
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="plus"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="size-5 absolute"
                    fill="currentColor"
                    initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                  >
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
          </DisclosureButton>
          <div className="overflow-hidden">
            <AnimatePresence>
              {open && (
                <DisclosurePanel static as={Fragment}>
                  <motion.div
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="origin-top bg-white dark:bg-[#080811] rounded-xl py-3 px-5 mt-1.5 font-normal"
                  >
                    {a}
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Disclosure>
  )
}

export default FAQItem
