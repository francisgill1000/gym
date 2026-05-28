<?php

namespace Database\Seeders;

use App\Models\Checkin;
use App\Models\Equipment;
use App\Models\GymClass;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Trainer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'manager@forgefitness.ae'],
            ['name' => 'Forge Manager', 'password' => Hash::make('password')]
        );

        $plans = [
            ['name' => 'Day Pass',          'code' => 'DP', 'color' => '#8a938f', 'price' => 75,   'cycle' => 'per visit',   'description' => 'Single-visit access to gym floor and locker rooms.',                'features' => ['Gym floor', 'Locker & towel', '1 guest discount'],                                       'status' => 'live'],
            ['name' => 'Off-Peak',          'code' => 'OP', 'color' => '#f0b65a', 'price' => 199,  'cycle' => 'per month',   'description' => 'Unlimited access between 10:00–16:00 on weekdays.',                'features' => ['Weekday 10–4', 'Gym floor', '2 classes / week'],                                         'status' => 'live'],
            ['name' => 'Monthly Unlimited', 'code' => 'MU', 'color' => '#00ffcc', 'price' => 349,  'cycle' => 'per month',   'description' => 'Full access, unlimited classes, all hours.',                       'features' => ['24/7 access', 'Unlimited classes', 'Sauna & recovery', '1 guest pass / mo'],             'status' => 'popular'],
            ['name' => 'Annual',            'code' => 'AN', 'color' => '#6aa9ff', 'price' => 3490, 'cycle' => 'per year',    'description' => 'Everything in Unlimited, billed yearly — 2 months free.',          'features' => ['Everything in Unlimited', '2 months free', 'Free InBody scan', 'Priority class booking'],'status' => 'live'],
            ['name' => 'Class Pack — 10',   'code' => 'CP', 'color' => '#a48cff', 'price' => 650,  'cycle' => '10 credits',  'description' => 'Ten studio class credits, valid for 3 months.',                    'features' => ['10 class credits', '3-month validity', 'All studio classes'],                            'status' => 'live'],
            ['name' => 'PT Add-on',         'code' => 'PT', 'color' => '#ff8aa3', 'price' => 180,  'cycle' => 'per session', 'description' => '1:1 personal-training session with a certified coach.',            'features' => ['55-min session', 'Program design', 'Progress tracking'],                                 'status' => 'live'],
        ];
        foreach ($plans as $p) {
            Plan::updateOrCreate(['code' => $p['code']], $p);
        }

        $trainers = [
            ['name' => 'Marcus Reyes', 'role' => 'Head Coach',          'specialty' => 'Strength & Conditioning', 'clients' => 28, 'classes_wk' => 11, 'rating' => 4.9, 'status' => 'on-shift', 'color' => '#00ffcc'],
            ['name' => 'Aisha Noor',   'role' => 'Senior Trainer',      'specialty' => 'HIIT & Metcon',           'clients' => 22, 'classes_wk' => 9,  'rating' => 4.8, 'status' => 'on-shift', 'color' => '#f0b65a'],
            ['name' => 'Diego Santos', 'role' => 'Trainer',             'specialty' => 'Olympic Lifting',         'clients' => 17, 'classes_wk' => 7,  'rating' => 4.7, 'status' => 'off',      'color' => '#6aa9ff'],
            ['name' => 'Lena Fischer', 'role' => 'Yoga & Mobility Lead','specialty' => 'Vinyasa · Mobility',      'clients' => 24, 'classes_wk' => 10, 'rating' => 5.0, 'status' => 'on-shift', 'color' => '#a48cff'],
            ['name' => 'Tariq Aziz',   'role' => 'Trainer',             'specialty' => 'Boxing & Conditioning',   'clients' => 19, 'classes_wk' => 8,  'rating' => 4.8, 'status' => 'off',      'color' => '#ff8aa3'],
            ['name' => 'Priya Menon',  'role' => 'Trainer',             'specialty' => 'Spin & Endurance',        'clients' => 15, 'classes_wk' => 9,  'rating' => 4.6, 'status' => 'on-shift', 'color' => '#34e6a4'],
        ];
        foreach ($trainers as $t) {
            Trainer::updateOrCreate(['name' => $t['name']], $t);
        }

        $byPlan = fn (string $name) => Plan::where('name', $name)->value('id');
        $members = [
            ['Omar Haddad',  'omar.h@gmail.com',       'Monthly Unlimited', 'active',  '2026-01-12', '07:28', 21, 349],
            ['Fatima Saleh', 'f.saleh@outlook.com',    'Annual',            'active',  '2025-03-02', '07:25', 18, 291],
            ['Liam Carter',  'liam.carter@gmail.com',  'Class Pack — 10',   'active',  '2026-04-18', '07:31', 9,  0],
            ['Mei Lin',      'mei.lin@icloud.com',     'Monthly Unlimited', 'active',  '2026-02-24', 'y',     16, 349],
            ['Yusuf Demir',  'yusuf.d@gmail.com',      'Monthly Unlimited', 'frozen',  '2025-11-09', '-19d',  2,  0],
            ['Sara Botros',  'sara.b@gmail.com',       'Off-Peak',          'active',  '2026-05-03', '-2d',   7,  199],
            ['Hannah Weber', 'h.weber@gmail.com',      'Annual',            'active',  '2025-06-21', '-3d',   11, 291],
            ['Karim Nasser', 'karim.n@outlook.com',    'Class Pack — 10',   'trial',   '2026-05-24', '06:55', 3,  0],
            ['Elena Popova', 'elena.p@gmail.com',      'Monthly Unlimited', 'active',  '2025-12-15', '18:02', 24, 349],
            ['Jamal Idris',  'jamal.i@gmail.com',      'Off-Peak',          'expired', '2025-08-30', '-31d',  0,  0],
            ['Nadia Rahman', 'nadia.r@icloud.com',     'Annual',            'active',  '2026-01-04', 'y',     19, 291],
            ['Tom Becker',   'tom.becker@gmail.com',   'Monthly Unlimited', 'active',  '2026-03-17', '12:10', 13, 349],
        ];
        $today = Carbon::create(2026, 5, 29, 18, 0, 0, 'Asia/Dubai');
        foreach ($members as [$name, $email, $plan, $status, $joined, $lastTok, $visits, $mrr]) {
            $last = null;
            if (preg_match('/^\d\d:\d\d$/', $lastTok)) {
                [$h, $i] = explode(':', $lastTok);
                $last = $today->copy()->setTime((int) $h, (int) $i);
            } elseif ($lastTok === 'y') {
                $last = $today->copy()->subDay()->setTime(18, 0);
            } elseif (preg_match('/^-(\d+)d$/', $lastTok, $m)) {
                $last = $today->copy()->subDays((int) $m[1])->setTime(18, 0);
            }
            Member::updateOrCreate(['email' => $email], [
                'name'          => $name,
                'phone'         => '+971 50 ' . random_int(100, 999) . ' ' . random_int(1000, 9999),
                'plan_id'       => $byPlan($plan),
                'status'        => $status,
                'joined_at'     => $joined,
                'last_visit_at' => $last,
                'visits_30d'    => $visits,
                'mrr'           => $mrr,
            ]);
        }

        $byTrainer = fn (string $name) => Trainer::where('name', $name)->value('id');
        $classes = [
            [0, '06:00', 60, 'Sunrise Strength',   'Strength', 'Marcus Reyes', 'Floor A',  16, 14],
            [0, '07:30', 45, 'Metcon Blitz',       'HIIT',     'Aisha Noor',   'Studio 1', 20, 20],
            [0, '12:00', 45, 'Express Cycle',      'Cycle',    'Priya Menon',  'Spin',     24, 18],
            [0, '18:00', 60, 'Power Hour',         'Strength', 'Diego Santos', 'Floor A',  16, 16],
            [0, '19:30', 60, 'Vinyasa Flow',       'Yoga',     'Lena Fischer', 'Studio 2', 22, 17],
            [1, '06:30', 45, 'HIIT 45',            'HIIT',     'Aisha Noor',   'Studio 1', 20, 16],
            [1, '09:00', 60, 'Mobility & Flow',    'Yoga',     'Lena Fischer', 'Studio 2', 22, 12],
            [1, '17:30', 60, 'Boxing Fundamentals','Boxing',   'Tariq Aziz',   'Ring',     14, 13],
            [1, '18:30', 45, 'Sprint Cycle',       'Cycle',    'Priya Menon',  'Spin',     24, 22],
            [2, '06:00', 60, 'Sunrise Strength',   'Strength', 'Marcus Reyes', 'Floor A',  16, 15],
            [2, '12:00', 45, 'Lunch Metcon',       'HIIT',     'Aisha Noor',   'Studio 1', 20, 14],
            [2, '18:00', 60, 'Olympic Lifting',    'Strength', 'Diego Santos', 'Floor A',  12, 12],
            [2, '19:30', 60, 'Candlelight Yoga',   'Yoga',     'Lena Fischer', 'Studio 2', 22, 20],
            [3, '06:30', 45, 'HIIT 45',            'HIIT',     'Aisha Noor',   'Studio 1', 20, 18],
            [3, '17:30', 60, 'Boxing Sparring',    'Boxing',   'Tariq Aziz',   'Ring',     14, 14],
            [3, '18:30', 45, 'Express Cycle',      'Cycle',    'Priya Menon',  'Spin',     24, 19],
            [3, '19:30', 60, 'Power Hour',         'Strength', 'Marcus Reyes', 'Floor A',  16, 13],
            [4, '06:00', 60, 'Sunrise Strength',   'Strength', 'Marcus Reyes', 'Floor A',  16, 16],
            [4, '12:00', 45, 'Express Cycle',      'Cycle',    'Priya Menon',  'Spin',     24, 20],
            [4, '18:00', 45, 'Friday Burn',        'HIIT',     'Aisha Noor',   'Studio 1', 20, 19],
            [4, '19:00', 60, 'Restore Yoga',       'Yoga',     'Lena Fischer', 'Studio 2', 22, 15],
            [5, '08:00', 60, 'Weekend Warrior',    'Strength', 'Diego Santos', 'Floor A',  18, 17],
            [5, '09:30', 45, 'Saturday Spin',      'Cycle',    'Priya Menon',  'Spin',     24, 24],
            [5, '11:00', 60, 'Boxing Bootcamp',    'Boxing',   'Tariq Aziz',   'Ring',     16, 12],
            [6, '09:00', 60, 'Slow Flow',          'Yoga',     'Lena Fischer', 'Studio 2', 22, 18],
            [6, '10:30', 45, 'Sunday Sweat',       'HIIT',     'Aisha Noor',   'Studio 1', 20, 11],
        ];
        GymClass::query()->delete();
        foreach ($classes as [$day, $start, $dur, $name, $type, $trainer, $room, $cap, $booked]) {
            GymClass::create([
                'day_of_week' => $day, 'start_time' => $start, 'duration' => $dur,
                'name' => $name, 'type' => $type, 'trainer_id' => $byTrainer($trainer),
                'room' => $room, 'capacity' => $cap, 'booked' => $booked,
            ]);
        }

        $equipment = [
            ['Rogue Power Rack',          'EQ-014', 'Floor A',      'Strength', 'operational',    '2026-04-12', 4210],
            ['Concept2 RowErg',           'EQ-031', 'Conditioning', 'Cardio',   'operational',    '2026-05-02', 6820],
            ['Assault AirBike #3',        'EQ-039', 'Conditioning', 'Cardio',   'maintenance',    '2026-05-26', 5140],
            ['Keiser M3i Spin Bike #11',  'EQ-052', 'Spin',         'Cardio',   'operational',    '2026-04-28', 7330],
            ['Eleiko Barbell Set',        'EQ-060', 'Floor A',      'Strength', 'operational',    '2026-03-30', 9120],
            ['Life Fitness Treadmill #6', 'EQ-071', 'Cardio',       'Cardio',   'out-of-service', '2026-05-20', 8410],
            ['Cable Crossover Station',   'EQ-080', 'Floor B',      'Strength', 'operational',    '2026-04-05', 5560],
            ['Boxing Ring Canvas',        'EQ-090', 'Ring',         'Combat',   'operational',    '2026-02-18', 2240],
        ];
        foreach ($equipment as [$name, $code, $zone, $cat, $status, $ls, $uses]) {
            Equipment::updateOrCreate(['code' => $code], [
                'name' => $name, 'zone' => $zone, 'category' => $cat,
                'status' => $status, 'last_serviced_at' => $ls, 'uses_lifetime' => $uses,
            ]);
        }

        $payments = [
            ['INV-8841', '2026-05-29', 'Elena Popova', 'Monthly Unlimited', 349,  'Card · 4242',   'paid'],
            ['INV-8840', '2026-05-29', 'Walk-in',      'Day Pass',          75,   'Card · 8821',   'paid'],
            ['INV-8839', '2026-05-28', 'Nadia Rahman', 'PT Add-on ×4',      720,  'Bank transfer', 'paid'],
            ['INV-8838', '2026-05-28', 'Tom Becker',   'Monthly Unlimited', 349,  'Card · 1107',   'paid'],
            ['INV-8837', '2026-05-27', 'Yusuf Demir',  'Monthly Unlimited', 349,  'Card · 5510',   'failed'],
            ['INV-8836', '2026-05-27', 'Karim Nasser', 'Class Pack — 10',   650,  'Card · 4419',   'pending'],
            ['INV-8835', '2026-05-26', 'Hannah Weber', 'Annual renewal',    3490, 'Card · 9032',   'paid'],
            ['INV-8834', '2026-05-25', 'Jamal Idris',  'Off-Peak',          199,  'Card · 2201',   'refunded'],
            ['INV-8833', '2026-05-24', 'Sara Botros',  'Off-Peak',          199,  'Card · 7781',   'paid'],
        ];
        Payment::query()->delete();
        foreach ($payments as [$inv, $date, $who, $item, $amt, $method, $status]) {
            Payment::create([
                'invoice_no'  => $inv,
                'member_id'   => Member::where('name', $who)->value('id'),
                'member_name' => $who,
                'item'        => $item, 'amount' => $amt,
                'method'      => $method, 'status' => $status, 'issued_at' => $date,
            ]);
        }

        $checkins = [
            ['Elena Popova',       'Monthly Unlimited', '18:02', 'Main turnstile',  'App QR'],
            ['Tom Becker',         'Monthly Unlimited', '12:10', 'Main turnstile',  'Wristband'],
            ['Karim Nasser',       'Class Pack — 10',   '06:55', 'Studio entrance', 'App QR'],
            ['Liam Carter',        'Class Pack — 10',   '07:31', 'Main turnstile',  'App QR'],
            ['Omar Haddad',        'Monthly Unlimited', '07:28', 'Main turnstile',  'Wristband'],
            ['Fatima Saleh',       'Annual',            '07:25', 'Main turnstile',  'App QR'],
            ['Walk-in · Day Pass', 'Day Pass',          '07:14', 'Front desk',      'Card · 4242'],
        ];
        Checkin::query()->delete();
        foreach ($checkins as [$name, $plan, $time, $gate, $method]) {
            [$h, $i] = explode(':', $time);
            Checkin::create([
                'member_id'     => Member::where('name', $name)->value('id'),
                'member_name'   => $name, 'plan_name' => $plan,
                'gate'          => $gate, 'method' => $method,
                'checked_in_at' => $today->copy()->setTime((int) $h, (int) $i),
            ]);
        }
    }
}
