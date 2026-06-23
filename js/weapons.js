// Weapons system (basic structure for future expansion)
class Weapon {
    constructor(name, damage, fireRate, maxAmmo) {
        this.name = name;
        this.damage = damage;
        this.fireRate = fireRate; // shots per second
        this.maxAmmo = maxAmmo;
        this.currentAmmo = maxAmmo;
    }

    fire() {
        if (this.currentAmmo > 0) {
            this.currentAmmo--;
            return true;
        }
        return false;
    }

    reload() {
        this.currentAmmo = this.maxAmmo;
    }
}

// Default pistol
const defaultWeapon = new Weapon('Pistol', 50, 10, 30);
