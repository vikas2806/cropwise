import { create } from 'zustand'

const useAppStore = create((set) => ({
  activeLayer: 'crop-type',
  selectedFieldId: null,
  selectedDate: '2024-10-15',
  districtFilter: 'all',

  setActiveLayer:     (layer)    => set({ activeLayer: layer }),
  setSelectedFieldId: (id)       => set({ selectedFieldId: id }),
  setSelectedDate:    (date)     => set({ selectedDate: date }),
  setDistrictFilter:  (district) => set({ districtFilter: district }),
}))

export default useAppStore
