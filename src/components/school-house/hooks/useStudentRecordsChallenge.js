import { useEffect, useMemo, useRef, useState } from 'react'

const studentsSeed = [
  { id: 's-101', name: 'Ari Vector', className: 'A', marks: 92, attempts: 5 },
  { id: 's-102', name: 'Mina Flux', className: 'B', marks: 76, attempts: 3 },
  { id: 's-103', name: 'Rohan Patch', className: 'A', marks: 88, attempts: 4 },
  { id: 's-104', name: 'Iris Kernel', className: 'C', marks: 95, attempts: 6 },
  { id: 's-105', name: 'Noah Stack', className: 'B', marks: 64, attempts: 2 },
  { id: 's-106', name: 'Zee Runtime', className: 'A', marks: 71, attempts: 3 },
  { id: 's-107', name: 'Lena Trace', className: 'C', marks: 84, attempts: 4 },
  { id: 's-108', name: 'Kai Byte', className: 'B', marks: 90, attempts: 7 },
  { id: 's-109', name: 'Milo Queue', className: 'A', marks: 58, attempts: 1 },
  { id: 's-110', name: 'Nia Pixel', className: 'C', marks: 79, attempts: 3 },
  { id: 's-111', name: 'Uma Merge', className: 'A', marks: 82, attempts: 5 },
]

const pageSize = 5

export default function useStudentRecordsChallenge() {
  const [queryInput, setQueryInput] = useState('')
  const [committedQuery, setCommittedQuery] = useState('')
  const [hasCommittedFirstQuery, setHasCommittedFirstQuery] = useState(false)
  const [selectedClass, setSelectedClass] = useState('all')
  const [requestClass, setRequestClass] = useState('all')
  const [page, setPage] = useState(1)
  const [isSyncing, setIsSyncing] = useState(false)
  const staleQueryRef = useRef('')

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const normalized = queryInput.trim().toLowerCase()
      if (!hasCommittedFirstQuery) {
        setCommittedQuery(normalized)
        staleQueryRef.current = normalized
        if (normalized) {
          setHasCommittedFirstQuery(true)
        }
        return
      }

      // Intentional stale query bug: all searches after first use stale previous query.
      setCommittedQuery(normalized)
      staleQueryRef.current = normalized
    }, 200)

    return () => window.clearTimeout(timerId)
  }, [hasCommittedFirstQuery, queryInput])

  useEffect(() => {
    // Intentional stale class request bug: request uses previous class value.
    const classForRequest = requestClass
    setRequestClass(selectedClass)

    setIsSyncing(true)
    const params = new URLSearchParams()
    params.set('query', committedQuery)
    params.set('class', classForRequest)
    params.set('page', String(page))

    fetch(`/api/student-records?${params.toString()}`, {
      method: 'GET',
      headers: { 'x-debug-quest': 'school-house' },
      keepalive: true,
    })
      .catch(() => {
        // Silent by design.
      })
      .finally(() => {
        setIsSyncing(false)
      })
  }, [committedQuery, page, requestClass, selectedClass])

  const filtered = useMemo(() => {
    const byClass = studentsSeed.filter((student) => selectedClass === 'all' || student.className === selectedClass)
    if (!committedQuery) return byClass

    return byClass.filter((student) => student.name.toLowerCase().includes(committedQuery))
  }, [committedQuery, selectedClass])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize))
  }, [filtered.length])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pagedStudents = useMemo(() => {
    const safePage = Math.max(1, Math.min(page, totalPages))
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, totalPages])

  function onSearchChange(value) {
    setQueryInput(value)
    setPage(1)
  }

  function onClassChange(value) {
    setSelectedClass(value)
    setPage(1)
  }

  return {
    students: pagedStudents,
    totalStudents: filtered.length,
    page,
    totalPages,
    queryInput,
    selectedClass,
    requestClass,
    isSyncing,
    onSearchChange,
    onClassChange,
    setPage,
  }
}
