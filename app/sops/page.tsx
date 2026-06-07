"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type SOP = {
  id: string;
  sop_code: string;
  title: string;
  sop_url: string;
  country: string;
  role: string;
  is_active: boolean;
};

export default function SOPPage() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [selectedSop, setSelectedSop] = useState<SOP | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [reviewedAt, setReviewedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSOPs();
  }, []);

  async function loadSOPs() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("sops")
      .select("*")
      .eq("is_active", true)
      .eq("country", "South Africa")
      .eq("role", "Doctor")
      .order("sop_code", { ascending: true });

    if (error) {
      console.error("Error loading SOPs:", error);
      setMessage("Unable to load SOPs. Please check Supabase table permissions.");
    } else {
      setSops(data || []);
    }

    setLoading(false);
  }

  async function selectSop(sop: SOP) {
    setSelectedSop(sop);
    setReviewed(false);
    setReviewedAt(null);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("sop_reviews")
      .select("reviewed_at")
      .eq("user_id", user.id)
      .eq("sop_id", sop.id)
      .maybeSingle();

    if (data?.reviewed_at) {
      setReviewed(true);
      setReviewedAt(data.reviewed_at);
    }
  }

  async function confirmReview() {
    if (!selectedSop) return;

    setSaving(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("You must be logged in to confirm SOP review.");
      setSaving(false);
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabase.from("sop_reviews").upsert(
      {
        user_id: user.id,
        sop_id: selectedSop.id,
        reviewed_at: now,
      },
      {
        onConflict: "user_id,sop_id",
      }
    );

    if (error) {
      console.error("Error saving SOP review:", error);
      setMessage("Could not save review. Check sop_reviews table and RLS policy.");
    } else {
      setReviewed(true);
      setReviewedAt(now);
      setMessage("SOP review recorded successfully.");
    }

    setSaving(false);
  }

  return (
    <>
      <TopNav />

      <div style={{ padding: "30px" }}>
        <h1>Standard Operating Procedures</h1>

        {message && (
          <p
            style={{
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}

        {loading ? (
          <p>Loading SOPs...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "350px 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div>
              {sops.length === 0 && (
                <p>No SOPs found. Please add SOP records in Supabase.</p>
              )}

              {sops.map((sop) => (
                <div
                  key={sop.id}
                  onClick={() => selectSop(sop)}
                  style={{
                    padding: "12px",
                    border:
                      selectedSop?.id === sop.id
                        ? "2px solid #4052b8"
                        : "1px solid #ddd",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background:
                      selectedSop?.id === sop.id ? "#f0f2ff" : "#ffffff",
                  }}
                >
                  <strong>{sop.sop_code}</strong>
                  <br />
                  {sop.title}
                </div>
              ))}
            </div>

            <div>
              {selectedSop ? (
                <>
                  <h2>{selectedSop.title}</h2>

                  <iframe
                    src={selectedSop.sop_url}
                    width="100%"
                    height="750"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />

                  <p style={{ marginTop: "15px" }}>
                    Please scroll through and review the full SOP before confirming.
                  </p>

                  {!reviewed && (
                    <button
                      onClick={confirmReview}
                      disabled={saving}
                      style={{
                        marginTop: "10px",
                        padding: "12px 20px",
                        background: "#4052b8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: saving ? "not-allowed" : "pointer",
                      }}
                    >
                      {saving ? "Saving..." : "Confirm I Have Reviewed This SOP"}
                    </button>
                  )}

                  {reviewed && (
                    <p
                      style={{
                        marginTop: "20px",
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      ✓ SOP reviewed successfully
                      {reviewedAt && (
                        <>
                          <br />
                          Reviewed on: {new Date(reviewedAt).toLocaleString()}
                        </>
                      )}
                    </p>
                  )}
                </>
              ) : (
                <p>Select an SOP to review.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
