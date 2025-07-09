'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestComponent() {
  console.log('TestComponent is rendering!');
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">🧪 Test Component</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-white space-y-4">
          <h2 className="text-xl font-bold text-green-400">✅ Component Rendering Successfully!</h2>
          <p>If you can see this, the component system is working.</p>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm">This is a test component to verify that React components are rendering properly in the admin dashboard.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900/20 p-3 rounded border border-blue-600">
              <h3 className="font-semibold text-blue-400">Test 1</h3>
              <p className="text-sm">Component imports working</p>
            </div>
            <div className="bg-green-900/20 p-3 rounded border border-green-600">
              <h3 className="font-semibold text-green-400">Test 2</h3>
              <p className="text-sm">UI components rendering</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
