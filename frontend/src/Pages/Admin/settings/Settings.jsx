import React from 'react'
import { SettingsForm } from './components/SettingsForm'
export const Settings = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <SettingsForm />
        </div>
    )
}
