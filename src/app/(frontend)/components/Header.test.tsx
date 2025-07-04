import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from './Header'

describe('Header', () => {
  it('renders the header element with mission-control-hud class', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toHaveClass('mission-control-hud')
  })

  it('renders the CDH  logo and text', () => {
    render(<Header />)
    expect(screen.getByText('CDH ')).toBeInTheDocument()
  })

  it('renders HUD items with correct data', () => {
    render(<Header />)
    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('Finance')).toBeInTheDocument()
    expect(screen.getByText('Contacts')).toBeInTheDocument()
  })

  it('toggles the CommandDeck on navigation button click', () => {
    render(<Header />)
    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)
    // The CommandDeck is rendered in a portal, so we need to look for it in the body
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
