import { TestDrivesList } from "./TestDriveList";

export default function TestDrives() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
            <TestDrivesList />
        </div>
    );
}
