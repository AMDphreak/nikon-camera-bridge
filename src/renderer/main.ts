import './style.css'

const statusEl = document.querySelector<HTMLParagraphElement>('#status')!
const exclusiveBtn = document.querySelector<HTMLButtonElement>('#exclusive')!
const virtualBtn = document.querySelector<HTMLButtonElement>('#virtual')!

async function refresh(): Promise<void> {
  const s = await window.bridgeApi.getState()
  statusEl.textContent = s.lastMessage
  exclusiveBtn.textContent = s.exclusiveAcquired ? 'Release exclusive (stub)' : 'Acquire exclusive (stub)'
  virtualBtn.textContent = s.virtualCameraActive ? 'Stop virtual camera (stub)' : 'Start virtual camera (stub)'
}

exclusiveBtn.addEventListener('click', async () => {
  const s = await window.bridgeApi.getState()
  await window.bridgeApi.setExclusive(!s.exclusiveAcquired)
  await refresh()
})

virtualBtn.addEventListener('click', async () => {
  const s = await window.bridgeApi.getState()
  await window.bridgeApi.setVirtualCamera(!s.virtualCameraActive)
  await refresh()
})

void refresh()
