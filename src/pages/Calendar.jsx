import { useMemo, useState } from "react";

import { useApp } from "../AppContext";

import { priorityColor } from "../utils";

const DOWS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar({
  openDrawer,
}) {
  const { tasks } = useApp();

  const today = new Date();

  const [viewDate, setViewDate] =
    useState(() => {
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
    });

  const year =
    viewDate.getFullYear();

  const month =
    viewDate.getMonth();

  function previousMonth() {
    setViewDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  }

  function nextMonth() {
    setViewDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  }

  function goToday() {
    const now = new Date();

    setViewDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );
  }

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const startDow =
    firstDay.getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const tasksByDate =
    useMemo(() => {
      const map =
        new Map();

      tasks.forEach(
        (task) => {
          if (
            !task.dueDate
          ) {
            return;
          }

          const due =
            new Date(
              task.dueDate
            );

          if (
            Number.isNaN(
              due.getTime()
            )
          ) {
            return;
          }

          const taskYear =
            due.getFullYear();

          const taskMonth =
            due.getMonth();

          const taskDay =
            due.getDate();

          const key =
            `${taskYear}-` +
            `${String(
              taskMonth + 1
            ).padStart(
              2,
              "0"
            )}-` +
            `${String(
              taskDay
            ).padStart(
              2,
              "0"
            )}`;

          if (
            !map.has(key)
          ) {
            map.set(
              key,
              []
            );
          }

          map
            .get(key)
            .push(task);
        }
      );

      return map;
    }, [tasks]);

  const cells = [];

  for (
    let i = 0;
    i < startDow;
    i++
  ) {
    cells.push(
      <div
        className="cal-cell empty"
        key={`empty-${i}`}
      />
    );
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const dateStr =
      `${year}-` +
      `${String(
        month + 1
      ).padStart(
        2,
        "0"
      )}-` +
      `${String(
        day
      ).padStart(
        2,
        "0"
      )}`;

    const dayTasks =
      tasksByDate.get(
        dateStr
      ) || [];

    const isToday =
      day ===
        today.getDate() &&
      month ===
        today.getMonth() &&
      year ===
        today.getFullYear();

    cells.push(
      <div
        className="cal-cell"
        key={dateStr}
      >
        <div
          className={
            `cal-date${
              isToday
                ? " today"
                : ""
            }`
          }
        >
          {day}
        </div>

        {dayTasks
          .slice(0, 3)
          .map(
            (task) => (
              <div
                className="cal-task"
                key={
                  task._id
                }
                style={{
                  borderColor:
                    priorityColor(
                      task.priority
                    ),
                }}
                onClick={() =>
                  openDrawer(
                    task._id
                  )
                }
              >
                {task.title}
              </div>
            )
          )}

        {dayTasks.length >
          3 && (
          <div
            style={{
              fontSize: 10,
              color:
                "var(--text-faint)",
            }}
          >
            +
            {dayTasks.length -
              3}{" "}
            more
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-pad view active">
      <div className="page-title-row">
        <div>
          <h1>
            Calendar
          </h1>

          <p className="sub">
            All tasks with a due
            date, across every
            board.
          </p>
        </div>
      </div>

      <div className="panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div className="section-sub-title">
            {MONTHS[month]}{" "}
            {year}
          </div>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 8,
            }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={
                previousMonth
              }
              title="Previous month"
            >
              ←
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={
                goToday
              }
            >
              Today
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={
                nextMonth
              }
              title="Next month"
            >
              →
            </button>
          </div>
        </div>

        <div className="cal-grid">
          {DOWS.map(
            (day) => (
              <div
                className="cal-dow"
                key={day}
              >
                {day}
              </div>
            )
          )}

          {cells}
        </div>
      </div>
    </div>
  );
}