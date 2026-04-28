import React from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";

type SectionHeadingProps = {
  children?: React.ReactNode;
  translationKey?: string;
};

export default function SectionHeading({ children, translationKey }: SectionHeadingProps) {
  const { t } = useTranslation();
  const text = translationKey ? t(translationKey) : children;

  return (
    <div className="flex flex-col items-center mb-10">
      <h2 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">
        {text}
      </h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
    </div>
  );
}
