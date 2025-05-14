import type { ReactNode } from 'react'
import { Drawer, DrawerContent } from '@/shared/ui/drawer'
import { useCallback } from 'react'
import { create } from 'zustand'

interface DialogControllerStore {
  isOpen: boolean
  content: ReactNode | null

  openDialog: (content: ReactNode) => void
  closeDialog: () => void

  onCloseListeners: (() => void)[]
  addOnCloseListener: (listener: () => void) => void
  removeOnCloseListener: (listener: () => void) => void
}

export const useDialogControllerStore = create<DialogControllerStore>()(
  set => ({
    isOpen: false,
    content: null,

    openDialog: content => set({ isOpen: true, content }),
    closeDialog: () =>
      set({
        isOpen: false,
        // NOTE: the `closeDialog` could be setting content to "null",
        // but then the close animation messes up a little bit.
        // The content disapperas before the animation finishes.
        //
        // content: null
      }),

    onCloseListeners: [],
    addOnCloseListener: listener =>
      set(state => ({
        onCloseListeners: [...state.onCloseListeners, listener],
      })),
    removeOnCloseListener: listener =>
      set(state => ({
        onCloseListeners: state.onCloseListeners.filter(l => l !== listener),
      })),
  }),
)

export function ControlledDialogEmitter() {
  const { isOpen, closeDialog, content, onCloseListeners }
    = useDialogControllerStore()

  const onOpenChange = useCallback(
    (value: boolean) => {
      if (!value) {
        onCloseListeners.forEach((listener) => {
          listener()
        })
        closeDialog()
      }
    },
    [closeDialog, onCloseListeners],
  )

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>{content}</DrawerContent>
    </Drawer>
  )
}
