"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    async function loadCourse() {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      setCourse(courseData);
      setLessons(lessonData || []);
      setActiveLesson(lessonData?.[0] || null);
    }

    loadCourse();
  }, [courseId]);

  async function markComplete() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !activeLesson) return;

    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: activeLesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    alert("Lesson marked complete");
  }

  return (
    <main className="min-h-screen bg-slate-50 grid grid-cols-1 md:grid-cols-4">
      <aside className="bg-white border-r p-5">
        <h2 className="font-bold text-blue-700 mb-4">{course?.title}</h2>

        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            onClick={() => setActiveLesson(lesson)}
            className="block w-full text-left p-3 rounded-xl mb-2 hover:bg-blue-50"
          >
            {index + 1}. {lesson.title}
          </button>
        ))}
      </aside>

      <section className="md:col-span-3 p-8">
        <h1 className="text-3xl font-bold mb-4">{activeLesson?.title}</h1>

        {activeLesson?.video_url && (
          <video controls className="w-full rounded-2xl bg-black mb-6">
            <source src={activeLesson.video_url} />
          </video>
        )}

        {activeLesson?.presentation_url && (
          <iframe
            src={activeLesson.presentation_url}
            className="w-full h-[500px] rounded-2xl border mb-6"
          />
        )}

        {activeLesson?.content && (
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <p className="whitespace-pre-line">{activeLesson.content}</p>
          </div>
        )}

        <button onClick={markComplete} className="bg-blue-700 text-white px-6 py-3 rounded-xl">
          Mark Lesson Complete
        </button>
      </section>
    </main>
  );
}
