import { InterestPoint } from "@/types"
import { useEffect, useState } from "react"
import * as geolib from "geolib"
import * as Location from "expo-location"
import { useMainContext } from "@/context/mainContext"

export function useMarkers({ userLocation }: { userLocation: Location.LocationObject | null }) {
  const [routeMarkers, setRouteMarkers] = useState<InterestPoint[]>([])
  const [routeOrigin, setRouteOrigin] = useState<Location.LocationObject | null>(null)
  const [nextMarker, setNextMarker] = useState<InterestPoint | null>(null)
  const [distanceNextMarker, setDistanceNextMarker] = useState<number | null>(null)
  const { interestPoints: markers, refreshInterestPoints } = useMainContext()

  /**
   * Refresh markers when interest points change
   */
  useEffect(() => {
    refreshInterestPoints()
  }, [refreshInterestPoints])

  useEffect(() => {
    if (!userLocation || markers.length === 0) return
    const sorted = [...markers].sort((a, b) => {
      const distA = geolib.getDistance(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        { latitude: a.latitude, longitude: a.longitude }
      )
      const distB = geolib.getDistance(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        { latitude: b.latitude, longitude: b.longitude }
      )
      return distA - distB
    })
    setRouteMarkers(sorted)
    setRouteOrigin(userLocation)
  }, [markers, userLocation, routeMarkers.length])

  useEffect(() => {
    const getDistanceToUser = (point: InterestPoint) => {
      if (!userLocation) return Infinity
      return geolib.getDistance(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        { latitude: point.latitude, longitude: point.longitude }
      )
    }
    if (!userLocation || routeMarkers.length === 0) return

    let foundNext = null
    let dist = null

    for (const marker of routeMarkers) {
      if (!marker.isVisited) {
        foundNext = marker
        dist = getDistanceToUser(marker)
        break
      }
    }

    setNextMarker(foundNext)
    setDistanceNextMarker(dist)

    if (foundNext && dist !== null && dist <= 50) {
      const updatedRoute = routeMarkers.map((m) =>
        m.id === foundNext.id ? { ...m, isVisited: true } : m
      )
      setRouteMarkers(updatedRoute)
    }
  }, [userLocation, routeMarkers])

  return { routeMarkers, routeOrigin, nextMarker, distanceNextMarker }
}
