import { useState, useEffect } from "react"
import { authClient } from "../../services/authentication"
import { getMyProfile } from "../../services/userProfile"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import NavBar from "../../components/NavBar"
import Recommendations from "../../components/Recommendations"
import EventFeedSection from "../../components/EventFeedSection"
import Footer from "../../components/Footer"
import HomeLocationUpdateDialog from "../../components/HomeLocationUpdateDialog"

export function FeedPage() {
  const { data: session, isPending } = authClient.useSession()
  const [profile, setProfile] = useState(null)
  // const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [currentPageNum, setCurrentPageNum] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const LIMIT = 10
  const offset = (currentPageNum - 1) * LIMIT

  
  // resets the current page when any of the filters change
  // useEffect(() => {
  //   setCurrentPageNum(1);
  // }, [city, tag, from, to]);

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

  const setNewHomeLocation = async () => {
    const { profile } = await getMyProfile();
    setProfile(profile);
  }

  const totalPages = Math.ceil(totalEvents / LIMIT);
  const hasNextPage = currentPageNum < totalPages;
  const hasPrevPage = currentPageNum > 1;

  return (
    <>
      <NavBar />
      {session && !profileLoading && <Recommendations profile={profile} />}
      {session && !profileLoading && profile &&
        <HomeLocationUpdateDialog 
          profile={profile}           
          setNewHomeLocation={setNewHomeLocation}
        />
      }
      <EventFeedSection profile={profile} isLoggedIn={!!session} />
      <Pagination>
        <PaginationContent>
          {hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => {
                  const isFirstPage = currentPageNum <= 1;
                  if (isFirstPage) return;

                  setCurrentPageNum(currentPageNum - 1);
                }} 
              />
            </PaginationItem>
          )}
  
          {hasNextPage && (
            <PaginationItem>
              <PaginationNext 
                onClick={() => {
                  const isLastPage = currentPageNum >= totalPages;
                  if (isLastPage) return;

                  setCurrentPageNum(currentPageNum + 1);
                }}
              />
            </PaginationItem>
          )}


        </PaginationContent>
      </Pagination>
      <Footer/>
      <Footer />
    </>
  )
}