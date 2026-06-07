"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type SOP = {
  id: string;
  sop_code: string;
  title: string;
  sop_url: string;
};

export default function SOPPage() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [selectedSop, setSelectedSop] = useState<SOP | null>(null);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    loadSOPs();
  }, []);

  async function loadSOPs() {
    const { data, error } = await supabase
      .from("sops")
      .select("*")
      .eq("is_active", true)
      .order("sop_code");

    if (!error && data) {
      setSops(data);
    }
  }

  async function confirmReview() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !selectedSop) return;

    const { error } = await supabase
      .from("sop_reviews")
      .insert({
        user_id: user.id,
        sop_id: selectedSop.id,
      });

    if (!error) {
      setReviewed(true);
      alert("SOP review recorded successfully.");
    }
  }

  return (
    <>
      <TopNav />

      <div style={{ padding: "30px" }}>
        <h1>Standard Operating Procedures</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div>
            {sops.map((sop) => (
              <div
                key={sop.id}
                onClick={() => {
                  setSelectedSop(sop);
                  setReviewed(false);
                }}
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
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
                <iframe
                  src={selectedSop.sop_url}
                  width="100%"
                  height="800"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />

                {!reviewed && (
                  <button
                    onClick={confirmReview}
                    style={{
                      marginTop: "20px",
                      padding: "12px 20px",
                      background: "#4052b8",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Confirm Review
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
                  </p>
                )}
              </>
            ) : (
              <p>Select an SOP to review.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
