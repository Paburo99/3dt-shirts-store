<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->latest()->limit(10))
            ->columns([
                Tables\Columns\TextColumn::make('reference')
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->placeholder('Guest'),
                Tables\Columns\TextColumn::make('total_amount')
                    ->money('COP', 0),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (OrderStatus $state): string => match ($state) {
                        OrderStatus::PENDING_PAYMENT => 'warning',
                        OrderStatus::PROCESSING => 'info',
                        OrderStatus::SHIPPED => 'primary',
                        OrderStatus::DELIVERED => 'success',
                        OrderStatus::CANCELLED, OrderStatus::FAILED => 'danger',
                    })
                    ->formatStateUsing(fn (OrderStatus $state): string => ucwords(str_replace('_', ' ', $state->value))),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Placed At'),
            ])
            ->actions([
                Action::make('view')
                    ->url(fn (Order $record): string => OrderResource::getUrl('view', ['record' => $record]))
                    ->icon('heroicon-m-eye'),
            ]);
    }
}
