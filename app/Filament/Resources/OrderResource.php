<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static string | \UnitEnum | null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Order Status')
                    ->schema([
                        Select::make('status')
                            ->options(collect(OrderStatus::cases())->mapWithKeys(
                                fn (OrderStatus $s) => [$s->value => ucwords(str_replace('_', ' ', $s->value))]
                            ))
                            ->required(),
                    ]),
                Section::make('Shipping Information')
                    ->schema([
                        TextInput::make('customer_name')->disabled(),
                        TextInput::make('customer_email')->disabled(),
                        TextInput::make('customer_phone')->disabled(),
                        TextInput::make('shipping_address')->disabled(),
                        TextInput::make('shipping_city')->disabled(),
                        TextInput::make('shipping_department')->disabled(),
                        Textarea::make('shipping_notes')->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->placeholder('Guest'),
                TextColumn::make('customer_email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('total_amount')
                    ->money('COP', 0)
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (OrderStatus $state): string => match ($state) {
                        OrderStatus::PENDING_PAYMENT => 'warning',
                        OrderStatus::PROCESSING => 'info',
                        OrderStatus::SHIPPED => 'primary',
                        OrderStatus::DELIVERED => 'success',
                        OrderStatus::CANCELLED, OrderStatus::FAILED => 'danger',
                    })
                    ->formatStateUsing(fn (OrderStatus $state): string => ucwords(str_replace('_', ' ', $state->value))),
                TextColumn::make('items_count')
                    ->counts('items')
                    ->label('Items'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Placed At'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options(collect(OrderStatus::cases())->mapWithKeys(
                        fn (OrderStatus $s) => [$s->value => ucwords(str_replace('_', ' ', $s->value))]
                    )),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Order Details')
                    ->schema([
                        TextEntry::make('reference'),
                        TextEntry::make('status')
                            ->badge()
                            ->color(fn (OrderStatus $state): string => match ($state) {
                                OrderStatus::PENDING_PAYMENT => 'warning',
                                OrderStatus::PROCESSING => 'info',
                                OrderStatus::SHIPPED => 'primary',
                                OrderStatus::DELIVERED => 'success',
                                OrderStatus::CANCELLED, OrderStatus::FAILED => 'danger',
                            })
                            ->formatStateUsing(fn (OrderStatus $state): string => ucwords(str_replace('_', ' ', $state->value))),
                        TextEntry::make('total_amount')
                            ->money('COP', 0),
                        TextEntry::make('wompi_transaction_id')
                            ->label('Wompi Transaction')
                            ->placeholder('N/A'),
                        TextEntry::make('created_at')
                            ->dateTime(),
                    ])->columns(3),
                Section::make('Customer / Shipping')
                    ->schema([
                        TextEntry::make('user.name')
                            ->label('User Account')
                            ->placeholder('Guest'),
                        TextEntry::make('customer_name'),
                        TextEntry::make('customer_email'),
                        TextEntry::make('customer_phone'),
                        TextEntry::make('shipping_address'),
                        TextEntry::make('shipping_city'),
                        TextEntry::make('shipping_department'),
                        TextEntry::make('shipping_notes')
                            ->placeholder('None'),
                    ])->columns(2),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
