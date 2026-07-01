import { useState, useEffect } from "react"
import { authClient } from "../../services/authentication"
import { getMyProfile } from "../../services/userProfile"

import NavBar from "../../components/NavBar"
import Recommendations from "../../components/Recommendations"
import EventFeedSection from "../../components/EventFeedSection"
import Footer from "../../components/Footer"

export function FeedPage() {
  const { data: session, isPending } = authClient.useSession()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setProfileLoading[false]
      return;
    }
    getMyProfile()
      .then(({ profile }) => {
        setProfile(profile)})
      .catch((err) => console.error(err))
      .finally(() => setProfileLoading(false))

  }, [isPending,session])

  if (isPending) return <p>Loading...</p>

  const handleFirstLoginComplete = async () => {
    const { profile } = await getMyProfile();
    const newCity = profile.homeLocation?.city || null;
    setHomeCity(newCity);

    if (newCity) {
      updateParam("city", newCity);
    }
  }

  return (
    <>
      <NavBar />
      {session && !profileLoading && <Recommendations profile={profile} />}
      <EventFeedSection profile={profile} isLoggedIn={!!session} />
      <Footer />
    </>
  )
}