<?php

namespace App\Filament\Resources;

use App\Enums\UserRole;
use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-users';

    protected static string | \UnitEnum | null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Customers';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('role')
                    ->badge()
                    ->color(fn (UserRole $state): string => $state->color())
                    ->formatStateUsing(fn (UserRole $state): string => $state->label()),
                TextColumn::make('orders_count')
                    ->counts('orders')
                    ->label('Orders')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Joined'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('role')
                    ->options(collect(UserRole::cases())->mapWithKeys(
                        fn (UserRole $r) => [$r->value => $r->label()]
                    )),
            ])
            ->actions([
                Action::make('changeRole')
                    ->label('Change Role')
                    ->icon('heroicon-o-shield-check')
                    ->color('warning')
                    ->form([
                        Select::make('role')
                            ->options(collect(UserRole::cases())->mapWithKeys(
                                fn (UserRole $r) => [$r->value => $r->label()]
                            ))
                            ->required(),
                    ])
                    ->fillForm(fn (User $record) => ['role' => $record->role->value])
                    ->action(fn (User $record, array $data) => $record->update(['role' => $data['role']]))
                    ->requiresConfirmation()
                    ->visible(fn () => auth()->user()->isSuperAdmin())
                    ->hidden(fn (User $record) => $record->id === auth()->id()),
                ViewAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Information')
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('email'),
                        TextEntry::make('role')
                            ->badge()
                            ->color(fn (UserRole $state): string => $state->color())
                            ->formatStateUsing(fn (UserRole $state): string => $state->label()),
                        TextEntry::make('created_at')
                            ->dateTime()
                            ->label('Joined'),
                    ])->columns(2),
                Section::make('Statistics')
                    ->schema([
                        TextEntry::make('orders_count')
                            ->state(fn (User $record) => $record->orders()->count())
                            ->label('Total Orders'),
                        TextEntry::make('total_spent')
                            ->state(fn (User $record) => 'COP ' . number_format($record->orders()->where('status', 'processing')->sum('total_amount'), 0, ',', '.'))
                            ->label('Total Spent'),
                        TextEntry::make('addresses_count')
                            ->state(fn (User $record) => $record->addresses()->count())
                            ->label('Saved Addresses'),
                    ])->columns(3),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'view' => Pages\ViewUser::route('/{record}'),
        ];
    }
}
