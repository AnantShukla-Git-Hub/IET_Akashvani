'use client';

import { useState } from 'react';
import { parseRollNumber, formatRollNumber, getCurrentAcademicYear } from '@/lib/rollNumberParser';

export default function TestParserPage() {
  const [rollNumber, setRollNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleTest = () => {
    const parsed = parseRollNumber(rollNumber);
    setResult(parsed);
  };

  const testCases = [
    { roll: '2500520100112', desc: '2025 batch, CSE Regular, Roll 12' },
    { roll: '2500520110045', desc: '2025 batch, CSE Self Finance, Roll 45' },
    { roll: '2500520120023', desc: '2025 batch, CSE AI, Roll 23' },
    { roll: '2400520100001', desc: '2024 batch, CSE Regular, Roll 01' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Roll Number Parser Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test the IET Lucknow roll number parser
          </p>

          {/* Current Academic Year */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Current Academic Year: <span className="font-bold">{getCurrentAcademicYear()}-{getCurrentAcademicYear() + 1}</span>
            </p>
          </div>

          {/* Test Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Roll Number (13 digits)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="2500520100112"
                maxLength={13}
              />
              <button
                onClick={handleTest}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Test
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`mb-6 p-4 rounded-lg ${result.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className="font-bold mb-3">
                {result.isValid ? '✓ Valid Roll Number' : '✗ Invalid Roll Number'}
              </h3>
              
              {result.isValid ? (
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Formatted:</span> {formatRollNumber(rollNumber)}</p>
                  <p><span className="font-medium">Admission Year:</span> {result.admissionYear}</p>
                  <p><span className="font-medium">Current Study Year:</span> {result.currentYear}{['st', 'nd', 'rd', 'th'][result.currentYear - 1]}</p>
                  <p><span className="font-medium">Branch:</span> {result.branch}</p>
                  <p><span className="font-medium">Branch Code:</span> {result.branchCode}</p>
                  <p><span className="font-medium">Class Roll Number:</span> {result.classRollNumber}</p>
                </div>
              ) : (
                <p className="text-sm text-red-800">{result.error}</p>
              )}
            </div>
          )}

          {/* Test Cases */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Test Cases</h3>
            <div className="space-y-2">
              {testCases.map((test, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRollNumber(test.roll);
                    setResult(parseRollNumber(test.roll));
                  }}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <p className="font-mono text-sm text-gray-900">{test.roll}</p>
                  <p className="text-xs text-gray-600">{test.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Format Explanation */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">Roll Number Format</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><span className="font-mono bg-white px-2 py-1 rounded">25</span> 00520100112 - Year (2025)</p>
              <p>25<span className="font-mono bg-white px-2 py-1 rounded">005</span>20100112 - College Code</p>
              <p>25005<span className="font-mono bg-white px-2 py-1 rounded">201</span>00112 - Unknown</p>
              <p>25005201<span className="font-mono bg-white px-2 py-1 rounded">0</span>0112 - Branch (0=CSE Regular, 1=CSE SF, 2=CSE AI)</p>
              <p>250052010<span className="font-mono bg-white px-2 py-1 rounded">01</span>12 - Unknown</p>
              <p>25005201001<span className="font-mono bg-white px-2 py-1 rounded">12</span> - Class Roll Number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
