"use client";

import { useEffect, useState } from "react";
import { DAY_NAMES, edmontonParts, formatTime12, hoursFor, weekdayOf, type DayHours, type HolidayOverride } from "@/lib/hours";

export function TodayHours({ weekly, overrides }: { weekly: DayHours[]; overrides: HolidayOverride[] }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const { date } = edmontonParts(new Date());
    const h = hoursFor({ weekly, overrides }, date);
    setText(h.closed ? "Closed today" : `Today: ${formatTime12(h.open)} to ${formatTime12(h.close)}`);
  }, [weekly, overrides]);
  return <span className="inline-block min-h-[1.5rem] font-extrabold">{text ?? " "}</span>;
}

export function WeeklyHours({ weekly }: { weekly: DayHours[] }) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-base">
      {order.map((d) => (
        <div key={d} className="contents">
          <dt className="font-bold">{DAY_NAMES[d]}</dt>
          <dd>{weekly[d]?.closed ? "Closed" : `${formatTime12(weekly[d]?.open ?? "00:00")} to ${formatTime12(weekly[d]?.close ?? "00:00")}`}</dd>
        </div>
      ))}
    </dl>
  );
}

export { weekdayOf };
