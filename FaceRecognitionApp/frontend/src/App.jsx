import { useEffect, useState } from "react";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import { Logo } from "./components/Logo/Logo";
import Navigation from "./components/Navigation/Navigation";
import ParticleBackground from "./components/ParticleBackground/ParticleBackground";
import Rank from "./components/Rank/Rank";
import { useFaceBoxes } from "./hooks/useFaceBoxes";
import SignInCard from "./components/SignIn/SignIn";
import RegisterCard from "./components/Register/Register";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function App() {
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    entries: 0,
    joined: "",
  })

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    })
    setImageUrl("")
    setRegions([]);
  }
  const [route, setRoute] = useState("signin");
  const [error, setError] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [regions, setRegions] = useState([]);


  const { imgRef, boxes, onImageLoad, updateBoxesFromRegions, reset } = useFaceBoxes();

  const onInputChange = (e) => setInputUrl(e.target.value);

  const isUrl = (s) => {
    try { new URL(s); return true; } catch { return false; }
  };

  // --- UNCHANGED: URL flow ---
  const onButtonSubmit = async () => {
    try {
      if (!inputUrl || !isUrl(inputUrl)) {
        setError("Please provide a valid image URL.");
        setImageUrl("");
        reset();
        setRegions([]);
        return;
      }

      setError("");
      setImageUrl(inputUrl);
      reset();
      setRegions([]);

      const response = await fetch(`${API_BASE}/clarifai/face-detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: inputUrl }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data) {
        try {
          const res = await fetch(`${API_BASE}/image`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
            id: user.id,
          }),
          });
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || `HTTP ${res.status}`);
          }

          const count = await res.json() // server returns the number
          setUser(prev => ({...prev, entries: count })); // update entries
        } catch (error) {
          console.error(error);
        }
      }

      const newRegions = data?.outputs?.[0]?.data?.regions || [];
      setRegions(newRegions);
    } catch (err) {
      setError(err.message || "Face Detection Failed");
      console.error(err);
    }
  };
  
  const onFileSelected = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
  
      // preview + reset UI
      setError("");
      reset();
      setRegions([]);
      setImageUrl(URL.createObjectURL(file));
  
      // send as multipart (no base64 bloat)
      const form = new FormData();
      form.append("image", file);
  
      const response = await fetch(`${API_BASE}/clarifai/face-detect/upload`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
      const clarifai = await response.json();
  
      // increment entries (same as before)
      if (user?.id) {
        const res = await fetch(`${API_BASE}/image`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id }),
        });
        if (!res.ok) throw new Error(await res.text());
        const count = await res.json();
        setUser((prev) => ({ ...prev, entries: count }));
      } else {
        console.warn("No user id; sign in before counting entries.");
      }
  
      const newRegions = clarifai?.outputs?.[0]?.data?.regions || [];
      setRegions(newRegions);
    } catch (err) {
      setError(err.message || "Face Detection Failed");
      console.error(err);
    } finally {
      e.target.value = ""; // allow re-selecting same file
    }
  };

  // Recompute boxes whenever regions change or image changes size
  useEffect(() => {
    updateBoxesFromRegions(regions);
  }, [regions, updateBoxesFromRegions]);

  const onRouteChange = (nextRoute) => setRoute(nextRoute);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-20">
        {route === "home" ? (
          <div className="relative z-10 flex flex-col gap-8 p-8">
            <Navigation onRouteChange={onRouteChange} />
            <Logo />
            <Rank name={user.name} entries={user.entries}  />

            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />

            {/* NEW: tiny upload control, no changes to ImageLinkForm */}
            <div className="flex justify-center items-center gap-3">
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-sm underline hover:text-blue-500"
              >
                or upload an image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileSelected}
              />
            </div>

            <div className="flex justify-center items-center">
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <FaceRecognition
              key={imageUrl} // force remount on new image
              imageUrl={imageUrl}
              boxes={boxes}
              imgRef={imgRef}
              onImageLoad={onImageLoad}
            />
          </div>
        ) : route === "signin" ? ( 
          <SignInCard loadUser={loadUser} onRouteChange={onRouteChange} /> 
        ) 
        : ( 
          <RegisterCard loadUser={loadUser} onRouteChange={onRouteChange} /> 
          )
        }
      </div>
    </div>
  );
}
